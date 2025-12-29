import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.COOKIE_NAME || "auth_token";

  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // ✅ Clear cookie (must match same name/path used when setting it)
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
