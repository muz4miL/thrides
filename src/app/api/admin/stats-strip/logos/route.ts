import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { randomUUID } from "crypto";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const COOKIE_NAME = "brandit_admin_session";
const ALLOWED_MAGIC: Record<string, { bytes: number[]; ext: string }> = {
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], ext: "png" },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], ext: "webp" },
  jpeg: { bytes: [0xff, 0xd8, 0xff], ext: "jpg" },
  avif: { bytes: [0x00, 0x00, 0x00], ext: "avif" },
};

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

function detectFormat(buf: Buffer): string | null {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "webp";
  return null;
}

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { statsLogos } = await getCollections();
    const logos = await statsLogos.find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ success: true, logos: logos.map((l) => ({ ...l, _id: String(l._id) })) });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "";
    const altText = (formData.get("altText") as string) || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File exceeds 2 MB limit." }, { status: 400 });
    }

    const { statsLogos } = await getCollections();
    const count = await statsLogos.countDocuments();
    if (count >= 20) {
      return NextResponse.json({ success: false, error: "Maximum 20 logos allowed." }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const fmt = detectFormat(rawBuffer);
    if (!fmt) {
      return NextResponse.json({ success: false, error: "Unsupported file type. Use PNG, WebP, JPEG, or AVIF." }, { status: 400 });
    }

    // Process with sharp: auto-trim, cap height 160px, convert to WebP
    const sharpInst = sharp(rawBuffer);
    const meta = await sharpInst.metadata();
    const processed = await sharpInst
      .trim()
      .resize({ height: 160, withoutEnlargement: true })
      .webp({ quality: 85 })
      .withMetadata({ icc: undefined })
      .toBuffer({ resolveWithObject: true });

    const contentHash = crypto.createHash("sha256").update(processed.data).digest("hex").slice(0, 24);

    // Deduplicate
    const existing = await statsLogos.findOne({ contentHash });
    if (existing) {
      return NextResponse.json({ success: false, error: "This logo has already been uploaded." }, { status: 409 });
    }

    let imageUrl = "";
    let storageKey = "";
    let warning: string | undefined;

    if (!meta.hasAlpha) {
      warning = "This image has no transparency. For best results use a PNG or WebP with transparent background.";
    }

    // Try Vercel Blob first, fallback to local disk
    const filename = `stats-logos/${contentHash}.webp`;
    try {
      const blob = await put(filename, processed.data, {
        access: "public",
        contentType: "image/webp",
      });
      imageUrl = blob.url;
      storageKey = blob.pathname;
    } catch {
      // Fallback: local disk
      const uploadDir = path.join(process.cwd(), "public", "uploads", "stats-logos");
      await fs.mkdir(uploadDir, { recursive: true });
      const diskFilename = `${contentHash}.webp`;
      await fs.writeFile(path.join(uploadDir, diskFilename), processed.data);
      imageUrl = `/uploads/stats-logos/${diskFilename}`;
      storageKey = diskFilename;
    }

    const now = new Date().toISOString();
    const logo = {
      id: randomUUID(),
      name: name.trim() || file.name.replace(/\.[^.]+$/, ""),
      altText: altText.trim() || name.trim() || file.name,
      imageUrl,
      storageKey,
      width: processed.info.width,
      height: processed.info.height,
      contentHash,
      sortOrder: count,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await statsLogos.insertOne(logo);
    return NextResponse.json({ success: true, logo, warning });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to upload" }, { status: 500 });
  }
}

