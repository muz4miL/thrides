import { NextResponse } from "next/server";

const COOKIE_NAME = "brandit_admin_session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
