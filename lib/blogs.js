import { cache } from "react";
import mongoose from "mongoose";
import slugify from "slugify";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";

const BLOG_FIELDS =
  "name slug content featured image excerpt createdAt updatedAt";

function serialize(data) {
  return JSON.parse(JSON.stringify(data));
}

export function stripHtml(html = "") {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getReadTime(html = "") {
  const plainText = stripHtml(html);
  const words = plainText ? plainText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function getDescription(blog) {
  const raw =
    blog?.excerpt?.trim() ||
    stripHtml(blog?.content || "") ||
    "Read this article on rimubhai.";

  return raw.length > 160 ? `${raw.slice(0, 157).trim()}...` : raw;
}

export function buildBlogLookup(slugOrId) {
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    return {
      $or: [{ _id: slugOrId }, { slug: slugOrId }],
    };
  }

  return { slug: slugOrId };
}

export function getBlogPath(blog) {
  return `/blogs/${blog?.slug || blog?._id}`;
}

export const getBlogs = cache(async () => {
  await connectDB();

  const blogs = await Blog.find({})
    .select(BLOG_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  return serialize(blogs);
});

export const getBlogBySlug = cache(async (slugOrId) => {
  await connectDB();

  const blog = await Blog.findOne(buildBlogLookup(slugOrId))
    .select(BLOG_FIELDS)
    .lean();

  return blog ? serialize(blog) : null;
});

export async function generateUniqueSlug(name, excludeId = null) {
  await connectDB();

  const base =
    slugify(name || "blog-post", {
      lower: true,
      strict: true,
      trim: true,
    }) || `blog-post-${Date.now()}`;

  let slug = base;
  let counter = 2;

  while (true) {
    const existing = await Blog.exists(
      excludeId
        ? { slug, _id: { $ne: excludeId } }
        : { slug }
    );

    if (!existing) return slug;

    slug = `${base}-${counter}`;
    counter += 1;
  }
}