import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import path from "path";
import fs from "fs/promises";

const COOKIE_NAME = "brandit_admin_session";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 35 * 1024 * 1024; // 35MB

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid session" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const focalX = Number(formData.get("focalX") || 50);
    const focalY = Number(formData.get("focalY") || 50);

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${mimeType}. Allowed formats: JPEG, PNG, WebP, AVIF, MP4, WebM.`,
        },
        { status: 400 },
      );
    }

    const isVideo = mimeType.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed ${isVideo ? "35MB" : "10MB"}.`,
        },
        { status: 400 },
      );
    }

    // Generate safe filename
    const originalExt = path.extname(file.name).toLowerCase() || (isVideo ? ".mp4" : ".jpg");
    const sanitizedBase = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}-${sanitizedBase}${originalExt}`;

    const uploadsDir = path.resolve(process.cwd(), "public", "uploads", "work");
    await fs.mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const targetPath = path.join(uploadsDir, uniqueFilename);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/work/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      mimeType,
      mediaType: isVideo ? "video" : "image",
      altText,
      focalPoint: { x: focalX, y: focalY },
    });
  } catch (err: unknown) {
    console.error("Media upload error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during upload" },
      { status: 500 },
    );
  }
}
