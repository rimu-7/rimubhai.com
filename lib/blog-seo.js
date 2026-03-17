import { cache } from "react";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://rimubhai.com";

export const SITE_NAME = "Rimu Bhai";
export const SITE_TITLE = "Rimu Bhai | Full Stack Developer";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/rimu.png`;
export const AUTHOR_NAME = "Rimu Mutasim Fuad";
export const AUTHOR_TWITTER = "@__rimu7_";

export const getBlogById = cache(async (id) => {
  try {
    await connectDB();

    const blog = await Blog.findById(id)
      .select("name slug content excerpt featured image createdAt updatedAt")
      .lean();

    if (!blog) return null;

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error("getBlogById error:", error);
    return null;
  }
});

export function stripHtml(html = "") {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogDescription(blog) {
  const raw =
    blog?.excerpt?.trim() ||
    stripHtml(blog?.content || "") ||
    "Read this article on Rimu Bhai.";

  if (raw.length <= 160) return raw;
  return `${raw.slice(0, 157).trim()}...`;
}

export function getBlogKeywords(blog) {
  const base = [
    "Rimu Bhai",
    "blog",
    "web development",
    "Next.js",
    "React",
    "JavaScript",
    "TypeScript",
    "full stack development",
  ];

  const titleWords = (blog?.name || "")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 8);

  return [...new Set([...base, ...titleWords])];
}

export function toAbsoluteUrl(value = "") {
  if (!value) return SITE_URL;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export function getBlogImage(blog) {
  return toAbsoluteUrl(blog?.image || DEFAULT_OG_IMAGE);
}

export function getBlogCanonicalPath(blog) {
  // Current route is /blogs/[id]
  // If you later migrate to /blogs/[slug], change this to `/blogs/${blog.slug}`
  return `/blogs/${blog._id}`;
}

export function getPublishedIso(blog) {
  return blog?.createdAt ? new Date(blog.createdAt).toISOString() : undefined;
}

export function getModifiedIso(blog) {
  return blog?.updatedAt
    ? new Date(blog.updatedAt).toISOString()
    : getPublishedIso(blog);
}