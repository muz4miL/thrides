import { NextResponse } from "next/server";
import { authenticateCredentials } from "@/server/auth";

const COOKIE_NAME = "brandit_admin_session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.data || body;

    const rawIdentifier = data.email || data.identifier;
    if (!rawIdentifier || !data.password) {
      return NextResponse.json({ success: false, error: "Email/username and password are required" }, { status: 400 });
    }

    const normalizedEmail = rawIdentifier.trim().includes("@")
      ? rawIdentifier.trim()
      : `${rawIdentifier.trim()}@brandit.agency`;

    const authResult = await authenticateCredentials(normalizedEmail, data.password);
    if (!authResult.success || !authResult.token) {
      return NextResponse.json({ success: false, error: authResult.error || "Authentication failed" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, user: authResult.user });

    res.cookies.set(COOKIE_NAME, authResult.token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: unknown) {
    console.error("Admin login error:", err);
    return NextResponse.json({ success: false, error: "Authentication system error" }, { status: 500 });
  }
}
