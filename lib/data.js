import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { cache } from "react";

// Cache the result for the duration of the request to avoid duplicate DB calls
export const getBlogs = cache(async () => {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    // Serialize for Client Components
    return blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(), // Ensure ISO string
      // Pre-calculate date string on server to fix Hydration Mismatch
      formattedDate: new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
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

    return {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      formattedDate: new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  } catch (error) {
    return null;
  }
});