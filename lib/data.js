import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { cache } from "react";

// Helper to sanitize MongoDB objects for Next.js Client Components
const sanitizeBlog = (blog) => {
  return {
    ...blog,
    _id: blog._id.toString(),
    // Handle userId if it exists (convert Buffer/ObjectId to string)
    userId: blog.userId ? blog.userId.toString() : null,
    // Convert Dates to ISO strings
    createdAt: blog.createdAt?.toISOString(),
    updatedAt: blog.updatedAt?.toISOString(),
    // Remove Mongoose version key
    __v: undefined,
    // Pre-calculate formatted date for consistency
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

    // Sanitize every blog post
    return blogs.map((blog) => sanitizeBlog(blog));
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

    // Sanitize the single post
    return sanitizeBlog(blog);
  } catch (error) {
    return null;
  }
});
