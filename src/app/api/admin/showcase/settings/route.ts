import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { DEFAULT_SHOWCASE_SETTINGS } from "@/server/showcase-service";

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
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { showcaseSettings } = await getCollections();
    let settings = await showcaseSettings.findOne({ id: "default" });
    if (!settings) {
      await showcaseSettings.insertOne(DEFAULT_SHOWCASE_SETTINGS as any);
      settings = await showcaseSettings.findOne({ id: "default" });
    }

    return NextResponse.json({
      success: true,
      settings: { ...settings, _id: String(settings!._id) },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { showcaseSettings } = await getCollections();
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (body.sectionBadge !== undefined) updates["sectionBadge"] = String(body.sectionBadge).trim();
    if (body.headingPrefix !== undefined) updates["headingPrefix"] = String(body.headingPrefix).trim();
    if (body.headingItalic !== undefined) updates["headingItalic"] = String(body.headingItalic).trim();
    if (body.marqueeSpeedSeconds !== undefined) updates["marqueeSpeedSeconds"] = Number(body.marqueeSpeedSeconds);
    if (body.sectionEnabled !== undefined) updates["sectionEnabled"] = Boolean(body.sectionEnabled);

    await showcaseSettings.updateOne({ id: "default" }, { $set: updates }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

