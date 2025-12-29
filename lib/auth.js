// src/lib/auth.js
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import { User } from "./schema";

export async function getCurrentUser() {
  try {
    const cookieName = process.env.COOKIE_NAME || "auth_token";

    // ✅ FIX: cookies() must be awaited in your Next.js version
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    // ✅ must match your signToken payload
    const userId = payload?.userId;
    if (!userId) return null;

    await connectDB();

    const user = await User.findById(userId).select("_id name email createdAt updatedAt");
    if (!user) return null;

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString?.() ?? null,
      updatedAt: user.updatedAt?.toISOString?.() ?? null,
    };
  } catch (err) {
    return null;
  }
}
