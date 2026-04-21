import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// DB & Schema
import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";

// Parsing utilities
import * as cheerio from "cheerio";
import slugify from "slugify";

// Custom Components
import BlogTOC from "./BlogTOC";
import BlogContent from "./BlogContent";
import Container from "@/components/Container";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rimubhai.com";
const SITE_NAME = "rimubhai";
const AUTHOR_NAME = "Rimu Bhai";

// --- Helper: Fetch Blog Data (cached per request) ---
const getBlog = cache(async (id) => {
  try {
    await connectDB();

    const blog = await Blog.findById(id)
      .select("name content featured image excerpt slug createdAt updatedAt")
      .lean();

    if (!blog) return null;

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
});

// --- Helper: Strip HTML safely ---
function stripHtml(html = "") {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Helper: Estimate reading time ---
function getReadTime(html = "") {
  const plainText = stripHtml(html);
  const words = plainText ? plainText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

// --- Helper: Create meta description ---
function getDescription(blog) {
  const raw =
    blog?.excerpt?.trim() ||
    stripHtml(blog?.content || "") ||
    "Read this article on rimubhai.";

  return raw.length > 160 ? `${raw.slice(0, 157).trim()}...` : raw;
}

// --- Helper: Process HTML and inject unique heading IDs for TOC ---
function processContent(htmlContent) {
  if (!htmlContent) return { html: "", toc: [] };

  const $ = cheerio.load(htmlContent);
  const toc = [];
  const usedIds = new Map();

  $("h2, h3").each((index, element) => {
    const text = $(element).text().trim();
    const tagName = (element.tagName || element.name || "h2").toLowerCase();

    if (!text) return;

    const baseId =
      slugify(text, { lower: true, strict: true, trim: true }) ||
      `heading-${index + 1}`;

    const count = usedIds.get(baseId) || 0;
    const uniqueId = count === 0 ? baseId : `${baseId}-${count + 1}`;
    usedIds.set(baseId, count + 1);

    $(element).attr("id", uniqueId);

    toc.push({
      id: uniqueId,
      text,
      level: tagName, // 'h2' or 'h3'
    });
  });

  return {
    html: $("body").html() || "",
    toc,
  };
}

// --- Main Page Component ---
export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  const { html: processedContent, toc } = processContent(blog.content);
  const readTime = getReadTime(blog.content);
  const description = getDescription(blog);
  const canonicalUrl = `${SITE_URL}/blogs/${blog._id}`;
  const imageUrl =
    blog.image && typeof blog.image === "string"
      ? blog.image.startsWith("http")
        ? blog.image
        : `${SITE_URL}${blog.image.startsWith("/") ? blog.image : `/${blog.image}`}`
      : `${SITE_URL}/rimu.png`;

  const publishedAt = blog.createdAt ? new Date(blog.createdAt) : null;
  const updatedAt = blog.updatedAt ? new Date(blog.updatedAt) : publishedAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.name,
    description,
    image: [imageUrl],
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString(),
  };

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="-ml-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <header className="mb-8 space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              {blog.featured && (
                <Badge className="rounded border-0 bg-primary/10 text-primary hover:bg-primary/20">
                  Featured Post
                </Badge>
              )}

              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {readTime} min read
              </span>

              {publishedAt && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {publishedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}

              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {AUTHOR_NAME}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
                {blog.name}
              </h1>

              {description && (
                <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                  {description}
                </p>
              )}
            </div>
          </header>

          <Separator className="my-8" />

          <article className="min-w-0">
            <BlogContent content={processedContent} />
          </article>
        </div>

        <aside className="min-w-0 lg:col-span-4">
          <BlogTOC toc={toc} />
        </aside>
      </div>
    </Container>
  );
}