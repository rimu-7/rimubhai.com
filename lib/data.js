import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { cache } from "react";

// Helper to serialize MongoDB objects for Next.js components
const serializeData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

export const getBlogs = cache(async () => {
  try {
    await connectDB();
    // lean() returns a plain JS object, faster than full Mongoose docs
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return blogs.map(serializeData);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
});

export const getBlogPost = cache(async (id) => {
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) return null;
    return serializeData(blog);
  } catch (error) {
    console.error(`Failed to fetch blog ${id}:`, error);
    return null;
  }
});