import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getAdminShowcaseData } from "@/server/showcase-service";
import { getCollections } from "@/server/db";
import { randomUUID } from "crypto";

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

    const data = await getAdminShowcaseData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const category = body.category || "ads";
    const { showcaseItems } = await getCollections();
    const count = await showcaseItems.countDocuments({ category });
    const now = new Date().toISOString();

    const newItem = {
      id: randomUUID(),
      category,
      title: (body.title || "Untitled Showcase Item").trim(),
      videoUrl: body.videoUrl?.trim() || "",
      posterUrl: body.posterUrl?.trim() || "",
      sender: body.sender?.trim() || "",
      subject: body.subject?.trim() || "",
      tag: body.tag?.trim() || "",
      heroImg: body.heroImg?.trim() || "",
      heading: body.heading?.trim() || "",
      subheading: body.subheading?.trim() || "",
      ctaText: body.ctaText?.trim() || "",
      accentColor: body.accentColor?.trim() || "#0056F5",
      theme: body.theme === "light" ? "light" : "dark",
      client: body.client?.trim() || "",
      url: body.url?.trim() || "",
      highlight: body.highlight?.trim() || "",
      description: body.description?.trim() || "",
      stats: Array.isArray(body.stats) ? body.stats : [],
      bgGradient: body.bgGradient?.trim() || "from-[#111116] via-[#161622] to-[#0d0d12]",
      sortOrder: count,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await showcaseItems.insertOne(newItem as any);
    return NextResponse.json({ success: true, item: newItem });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
