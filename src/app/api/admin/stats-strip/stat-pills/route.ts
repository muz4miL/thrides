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

const DEFAULT_PILLS = [
  { value: "3 Years", sortOrder: 0 },
  { value: "14+ Businesses", sortOrder: 1 },
  { value: "8 Countries", sortOrder: 2 },
];

async function ensureDefaults() {
  const { statPills } = await getCollections();
  const count = await statPills.countDocuments();
  if (count === 0) {
    const now = new Date().toISOString();
    await statPills.insertMany(
      DEFAULT_PILLS.map((p) => ({
        id: randomUUID(),
        value: p.value,
        sortOrder: p.sortOrder,
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
    const { statPills } = await getCollections();
    const pills = await statPills.find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ success: true, pills: pills.map((p) => ({ ...p, _id: String(p._id) })) });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    if (!body.value?.trim()) return NextResponse.json({ success: false, error: "value is required" }, { status: 400 });
    const { statPills } = await getCollections();
    const count = await statPills.countDocuments();
    const now = new Date().toISOString();
    const pill = {
      id: randomUUID(),
      value: String(body.value).trim(),
      sortOrder: count,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await statPills.insertOne(pill);
    return NextResponse.json({ success: true, pill });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

