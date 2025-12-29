import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { signToken } from "@/lib/jwt";
import { User } from "@/lib/schema";

function jsonError(message, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Invalid email", 400);
    if (!password) return jsonError("Password is required", 400);

    const user = await User.findOne({ email }).select("+password");
    if (!user) return jsonError("Invalid credentials", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return jsonError("Invalid credentials", 401);

    const token = signToken({ userId: String(user._id) });
    const cookieName = process.env.COOKIE_NAME || "auth_token";

    const res = NextResponse.json(
      {
        message: "Logged in",
        user: { id: String(user._id), name: user.name, email: user.email },
      },
      { status: 200 }
    );

    res.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
