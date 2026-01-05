import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const item = await Blog.findById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedItem = await Blog.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: updatedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove an item
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedItem = await Blog.findByIdAndDelete(id);

    if (!deletedItem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}