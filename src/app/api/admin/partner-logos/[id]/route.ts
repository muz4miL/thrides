import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { updatePartnerLogo, deletePartnerLogo } from "@/server/partner-logo-service";
import { z } from "zod";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  altText: z.string().min(1).optional(),
  linkUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const updates: {
      name?: string;
      altText?: string;
      linkUrl?: string | null;
      isActive?: boolean;
    } = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.altText !== undefined) updates.altText = parsed.data.altText;
    if (parsed.data.linkUrl !== undefined) updates.linkUrl = parsed.data.linkUrl;
    if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

    const updated = await updatePartnerLogo(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Logo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, logo: updated });
  } catch (err: unknown) {
    console.error("PATCH partner-logo error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to update logo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deletePartnerLogo(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Logo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE partner-logo error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to delete logo" },
      { status: 500 }
    );
  }
}
