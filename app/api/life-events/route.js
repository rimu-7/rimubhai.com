import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { LifeEvent } from "@/lib/schema";

export async function GET() {
  try {
    await connectDB();

    const events = await LifeEvent.find({}).sort({ date: -1 });

    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const newEvent = await LifeEvent.create(body);

    return NextResponse.json({ data: newEvent }, { status: 201 });
  } catch (error) {
    console.error("❌ POST ERROR:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
