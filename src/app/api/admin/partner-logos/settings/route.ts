import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getPartnerLogoSettings, updatePartnerLogoSettings } from "@/server/partner-logo-service";
import { z } from "zod";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

const settingsSchema = z.object({
  displayMode: z.enum(["static", "marquee"]).optional(),
  marqueeSpeed: z.enum(["slow", "normal", "fast"]).optional(),
  logoHeight: z.number().min(24).max(48).optional(),
  tone: z.enum(["original", "muted", "mono-white"]).optional(),
  floatEffect: z.boolean().optional(),
  sectionEnabled: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getPartnerLogoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("GET settings error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = settingsSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid settings payload" },
        { status: 400 }
      );
    }

    const updates: {
      displayMode?: "static" | "marquee";
      marqueeSpeed?: "slow" | "normal" | "fast";
      logoHeight?: number;
      tone?: "original" | "muted" | "mono-white";
      floatEffect?: boolean;
      sectionEnabled?: boolean;
    } = {};
    if (parsed.data.displayMode !== undefined) updates.displayMode = parsed.data.displayMode;
    if (parsed.data.marqueeSpeed !== undefined) updates.marqueeSpeed = parsed.data.marqueeSpeed;
    if (parsed.data.logoHeight !== undefined) updates.logoHeight = parsed.data.logoHeight;
    if (parsed.data.tone !== undefined) updates.tone = parsed.data.tone;
    if (parsed.data.floatEffect !== undefined) updates.floatEffect = parsed.data.floatEffect;
    if (parsed.data.sectionEnabled !== undefined) updates.sectionEnabled = parsed.data.sectionEnabled;

    const settings = await updatePartnerLogoSettings(updates);
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("PATCH settings error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to update settings" },
      { status: 500 }
    );
  }
}
