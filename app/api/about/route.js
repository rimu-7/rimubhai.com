import { getCurrentUser } from "@/lib/auth"; // or your auth path
import connectDB from "@/lib/mongodb";
import { About } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Parse Data
    const body = await req.json();
    const { name, content, onGoing } = body;

    // 2. Validate Input
    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and Content are required" },
        { status: 400 }
      );
    }

    // 3. Get User safely
    const user = await getCurrentUser();

    // If no user, return 401 (Frontend handles the redirect)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: Auth libraries often use 'id', Database users use '_id'. Check both.
    const userId = user._id || user.id;

    if (!userId) {
      console.error("Auth Error: User object exists but has no ID:", user);
      return NextResponse.json(
        { error: "User ID missing from session" },
        { status: 500 }
      );
    }

    // 4. Create Item
    const newItem = await About.create({
      userId,
      name,
      content,
      onGoing: onGoing || false,
    });

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Fetch items and sort by 'createdAt' in descending order (newest first)
    const items = await About.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
