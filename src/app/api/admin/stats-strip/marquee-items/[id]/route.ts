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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { marqueeItems } = await getCollections();
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.text !== undefined) updates["text"] = String(body.text).trim();
    if (body.isActive !== undefined) updates["isActive"] = Boolean(body.isActive);
    if (body.sortOrder !== undefined) updates["sortOrder"] = Number(body.sortOrder);
    const result = await marqueeItems.updateOne({ id }, { $set: updates });
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
    const { marqueeItems } = await getCollections();
    const result = await marqueeItems.deleteOne({ id });
    if (!result.deletedCount) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

