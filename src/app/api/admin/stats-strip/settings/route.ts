import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";

const COOKIE_NAME = "brandit_admin_session";
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

const DEFAULT_SETTINGS = {
  id: "default",
  marqueeSectionEnabled: true,
  marqueeSpeedPixelsPerSec: 40,
  logoCloudEnabled: true,
};

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { statsStripSettings } = await getCollections();
    let settings = await statsStripSettings.findOne({ id: "default" });
    if (!settings) {
      const doc = { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
      await statsStripSettings.insertOne(doc);
      settings = await statsStripSettings.findOne({ id: "default" });
    }
    return NextResponse.json({ success: true, settings: { ...settings, _id: String(settings!._id) } });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { statsStripSettings } = await getCollections();
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.marqueeSectionEnabled !== undefined) updates["marqueeSectionEnabled"] = Boolean(body.marqueeSectionEnabled);
    if (body.marqueeSpeedPixelsPerSec !== undefined) updates["marqueeSpeedPixelsPerSec"] = Number(body.marqueeSpeedPixelsPerSec);
    if (body.logoCloudEnabled !== undefined) updates["logoCloudEnabled"] = Boolean(body.logoCloudEnabled);
    await statsStripSettings.updateOne({ id: "default" }, { $set: updates }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

