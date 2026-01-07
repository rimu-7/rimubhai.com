import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Project } from "@/lib/schema";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    // 1. Extract Fields
    const file = formData.get("image");
    const title = formData.get("title");
    const description = formData.get("description");
    const liveUrl = formData.get("liveUrl");
    const repoUrl = formData.get("repoUrl");
    const featured = formData.get("featured") === "true";

    const tags =
      formData
        .get("tags")
        ?.split(",")
        .map((t) => t.trim()) || [];

    if (!file || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Upload Image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "portfolio-projects" }, (error, result) =>
          error ? reject(error) : resolve(result)
        )
        .end(buffer);
    });

    // 3. Create Project
    const newProject = await Project.create({
      title,
      description,
      imageUrl: uploadResponse.secure_url,
      liveUrl,
      repoUrl,
      tags,
      featured,
    });

    return NextResponse.json({ data: newProject }, { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
