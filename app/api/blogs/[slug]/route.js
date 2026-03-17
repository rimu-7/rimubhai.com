import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import {
  buildBlogLookup,
  generateUniqueSlug,
} from "@/lib/blogs";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const item = await Blog.findOne(buildBlogLookup(slug))
      .select("name slug content featured image excerpt createdAt updatedAt")
      .lean();

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: JSON.parse(JSON.stringify(item)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ BLOG GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const existing = await Blog.findOne(buildBlogLookup(slug));

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();

    const updateData = {};

    if (typeof body.name === "string" && body.name.trim()) {
      updateData.name = body.name.trim();

      if (updateData.name !== existing.name) {
        updateData.slug = await generateUniqueSlug(updateData.name, existing._id);
      }
    }

    if (typeof body.content === "string") {
      updateData.content = body.content;
    }

    if (typeof body.featured === "boolean") {
      updateData.featured = body.featured;
    }

    const updatedItem = await Blog.findByIdAndUpdate(existing._id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${existing.slug}`);
    revalidatePath(`/blogs/${updatedItem.slug}`);

    return NextResponse.json(
      { data: JSON.parse(JSON.stringify(updatedItem)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ BLOG UPDATE Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const existing = await Blog.findOne(buildBlogLookup(slug));

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await Blog.findByIdAndDelete(existing._id);

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${existing.slug}`);

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ BLOG DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}