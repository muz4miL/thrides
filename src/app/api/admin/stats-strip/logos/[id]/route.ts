import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const COOKIE_NAME = "brandit_admin_session";
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { statsLogos } = await getCollections();
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.name !== undefined) updates["name"] = String(body.name).trim();
    if (body.altText !== undefined) updates["altText"] = String(body.altText).trim();
    if (body.isActive !== undefined) updates["isActive"] = Boolean(body.isActive);
    if (body.sortOrder !== undefined) updates["sortOrder"] = Number(body.sortOrder);
    const result = await statsLogos.updateOne({ id }, { $set: updates });
    if (!result.matchedCount) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { statsLogos } = await getCollections();
    const logo = await statsLogos.findOne({ id });
    if (!logo) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Attempt blob / local file deletion
    if (logo.storageKey && !logo.storageKey.startsWith("/")) {
      try { await del(logo.storageKey); } catch { /* blob may not exist */ }
    } else if (logo.storageKey) {
      try {
        await fs.unlink(path.join(process.cwd(), "public", logo.imageUrl.replace(/^\//, "")));
      } catch { /* file may not exist */ }
    }

    await statsLogos.deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

