import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Experience } from "@/lib/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    // Sort: Current jobs first, then by start date descending
    const experiences = await Experience.find({}).sort({
      current: -1,
      startDate: -1,
    });
    return NextResponse.json({ data: experiences }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Protect Route
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const newExperience = await Experience.create(body);

    return NextResponse.json({ data: newExperience }, { status: 201 });
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
