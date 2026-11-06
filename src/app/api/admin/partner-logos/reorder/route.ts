import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { reorderPartnerLogos } from "@/server/partner-logo-service";
import { z } from "zod";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

const reorderSchema = z.object({
  orderIds: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = reorderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid reorder payload. Array of IDs required." },
        { status: 400 }
      );
    }

    await reorderPartnerLogos(parsed.data.orderIds);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("POST reorder error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to reorder logos" },
      { status: 500 }
    );
  }
}

