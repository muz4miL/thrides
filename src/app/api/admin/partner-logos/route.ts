import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getAllPartnerLogos, processAndUploadLogo } from "@/server/partner-logo-service";
import { z } from "zod";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await getAllPartnerLogos();
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    console.error("GET partner-logos error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "";
    const altText = (formData.get("altText") as string) || "";
    const linkUrlRaw = (formData.get("linkUrl") as string) || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 2 MB max size
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 2 MB limit. Please compress or optimize the image." },
        { status: 400 }
      );
    }

    // Validate linkUrl if provided
    let linkUrl: string | null = null;
    if (linkUrlRaw.trim() !== "") {
      const urlParsed = z.string().url().safeParse(linkUrlRaw.trim());
      if (!urlParsed.success) {
        return NextResponse.json(
          { success: false, error: "Link URL must be a valid https:// URL." },
          { status: 400 }
        );
      }
      linkUrl = urlParsed.data;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processAndUploadLogo({
      buffer,
      originalFilename: file.name,
      name,
      altText,
      linkUrl,
    });

    return NextResponse.json({
      success: true,
      logo: result.logo,
      warning: result.warning,
    });
  } catch (err: unknown) {
    console.error("POST partner-logos error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to process and upload logo." },
      { status: 400 }
    );
  }
}

