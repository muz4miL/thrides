import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";

const COOKIE_NAME = "brandit_admin_session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: { id: session.userId, email: session.email, role: session.role },
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
