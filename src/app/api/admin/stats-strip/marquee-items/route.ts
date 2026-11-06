import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { randomUUID } from "crypto";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

const DEFAULT_MARQUEE = [
  "3 Years Track Record",
  "14+ Businesses Supported",
  "8 Countries Reached",
  "On-Purpose Marketing",
  "Conversion Websites",
  "Measurable Results",
];

async function ensureDefaults() {
  const { marqueeItems } = await getCollections();
  const count = await marqueeItems.countDocuments();
  if (count === 0) {
    const now = new Date().toISOString();
    await marqueeItems.insertMany(
      DEFAULT_MARQUEE.map((text, i) => ({
        id: randomUUID(),
        text,
        sortOrder: i,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }))
    );
  }
}

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    await ensureDefaults();
    const { marqueeItems } = await getCollections();
    const items = await marqueeItems.find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ success: true, items: items.map((i) => ({ ...i, _id: String(i._id) })) });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    if (!body.text?.trim()) return NextResponse.json({ success: false, error: "text is required" }, { status: 400 });
    const { marqueeItems } = await getCollections();
    const count = await marqueeItems.countDocuments();
    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      text: String(body.text).trim(),
      sortOrder: count,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await marqueeItems.insertOne(item);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

