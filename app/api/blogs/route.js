import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { generateUniqueSlug } from "@/lib/blogs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const name = body?.name?.trim();
    const content = body?.content?.trim();
    const featured = Boolean(body?.featured);

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and Content are required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id || user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing from session" },
        { status: 500 }
      );
    }

    const slug = await generateUniqueSlug(name);

    const newItem = await Blog.create({
      userId,
      name,
      slug,
      content,
      featured,
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);

    return NextResponse.json(
      { data: JSON.parse(JSON.stringify(newItem)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") || 100);
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 100)
      : 100;

    const items = await Blog.find({})
      .select("name slug content featured image excerpt createdAt updatedAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      { data: JSON.parse(JSON.stringify(items)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}