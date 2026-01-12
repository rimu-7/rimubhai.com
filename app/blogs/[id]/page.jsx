import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
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

// --- Helper: Fetch Blog Data ---
async function getBlog(id) {
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) return null;
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    return null;
  }
}

// --- Helper: Process HTML (Inject IDs for TOC) ---
function processContent(htmlContent) {
  if (!htmlContent) return { html: "", toc: [] };

  const $ = cheerio.load(htmlContent);
  const toc = [];

  // Find all h2 and h3 headers
  $("h2, h3").each((index, element) => {
    const text = $(element).text();
    // Create a URL-safe ID (e.g., "My Header" -> "my-header")
    const id =
      slugify(text, { lower: true, strict: true }) || `heading-${index}`;

    // Inject the ID into the HTML tag so the browser can scroll to it
    $(element).attr("id", id);

    toc.push({
      id,
      text,
      level: element.tagName.toLowerCase(), // 'h2' or 'h3'
    });
  });

  return {
    html: $("body").html(), // Returns the HTML with the new IDs
    toc,
  };
}

// --- Main Page Component ---
export default async function BlogDetailsPage({ params }) {
  // Await params for Next.js 15+ compatibility
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  // 1. Process HTML to add IDs and get TOC data
  const { html: processedContent, toc } = processContent(blog.content);

  // 2. Calculate Reading Time (strip HTML tags first)
  const plainText = blog.content.replace(/<[^>]*>?/gm, "");
  const words = plainText.split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Navigation Back Button */}
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* --- LEFT COLUMN: Content (Span 8) --- */}
        <div className="lg:col-span-8 min-w-0">
          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              {blog.featured && (
                <Badge className="bg-primary/10 rounded text-primary hover:bg-primary/20 border-0 transition-colors">
                  Featured Post
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {blog.name}
            </h1>
          </header>

          <Separator className="my-8" />

          {/* Mobile TOC (Visible only on small screens) */}
          <div className="block lg:hidden mb-8">
            <BlogTOC toc={toc} />
          </div>

          {/* Article Content Rendered with Copy Buttons */}
          <article>
            <BlogContent content={processedContent} />
          </article>
        </div>

        {/* --- RIGHT COLUMN: Sidebar TOC (Span 4) --- */}
        <div className="hidden lg:block lg:col-span-4 relative">
          {/* The component handles the sticky positioning internally or we add it here */}
          <div className="sticky top-24">
            <BlogTOC toc={toc} />
          </div>
        </div>
      </div>
    </div>
  );
}
