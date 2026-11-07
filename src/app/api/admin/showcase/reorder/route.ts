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

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, error: "orderedIds must be an array" }, { status: 400 });
    }

    const { showcaseItems } = await getCollections();
    const now = new Date().toISOString();
    await Promise.all(
      orderedIds.map((id: string, idx: number) =>
        showcaseItems.updateOne({ id }, { $set: { sortOrder: idx, updatedAt: now } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
