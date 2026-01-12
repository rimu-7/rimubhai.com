import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { cache } from "react";
import mongoose from "mongoose";

// Helper to sanitize MongoDB objects for Next.js Client Components
const sanitizeBlog = (blog) => {
  return {
    ...blog,
    _id: blog._id.toString(),
    userId: blog.userId ? blog.userId.toString() : null,
    createdAt: blog.createdAt?.toISOString(),
    updatedAt: blog.updatedAt?.toISOString(),
    __v: undefined,
    formattedDate: new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

export const getBlogs = cache(async () => {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

    return blogs.map((blog) => sanitizeBlog(blog));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
});

export const getBlogPost = cache(async (id) => {
  try {
    await connectDB();

    // Prevent 500 Crash: Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const blog = await Blog.findById(id).lean();
    if (!blog) return null;

    return sanitizeBlog(blog);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
});
