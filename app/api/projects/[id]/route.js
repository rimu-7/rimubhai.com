import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Project } from "@/lib/schema";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const liveUrl = formData.get("liveUrl");
    const repoUrl = formData.get("repoUrl");
    const tagsRaw = formData.get("tags");
    const file = formData.get("image");
    const featured = formData.get("featured") === "true";

    const updateData = {
      title,
      description,
      liveUrl,
      repoUrl,
      featured,
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : [],
    };

    // Only upload if new image provided
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio-projects" },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(buffer);
      });
      updateData.imageUrl = uploadResponse.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedProject) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: updatedProject });

  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}