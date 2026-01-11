import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Award } from "@/lib/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const awards = await Award.find({}).sort({ date: -1 });
    return NextResponse.json({ data: awards }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const newAward = await Award.create(body);
    return NextResponse.json({ data: newAward }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}