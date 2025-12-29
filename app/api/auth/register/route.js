import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/schema";
import { signToken } from "@/lib/jwt";

function jsonError(message, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    // ✅ validations
    if (!name || name.length < 2)
      return jsonError("Name must be at least 2 characters", 400);
    if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Invalid email", 400);
    if (!password || password.length < 6)
      return jsonError("Password must be at least 6 characters", 400);

    // ✅ check duplicate
    const exists = await User.findOne({ email }).select("_id").lean();
    if (exists) return jsonError("Email already exists", 409);

    // ✅ hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    // ✅ create jwt
    const token = signToken({ userId: String(user._id) });

    const cookieName = process.env.COOKIE_NAME || "auth_token";

    const res = NextResponse.json(
      {
        message: "Registered",
        user: { id: String(user._id), name: user.name, email: user.email },
      },
      { status: 201 }
    );

    // ✅ httpOnly cookie
    res.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    return NextResponse.json({ message: "internal server error" });
  }
}
