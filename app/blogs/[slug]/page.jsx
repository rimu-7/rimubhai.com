export const revalidate = 300;

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as cheerio from "cheerio";
import slugify from "slugify";

import BlogTOC from "./BlogTOC";
import BlogContent from "./BlogContent";
import Container from "@/components/Container";
import {
  getBlogBySlug,
  getBlogPath,
  getDescription,
  getReadTime,
} from "@/lib/blogs";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rimubhai.com";
const AUTHOR_NAME = "Rimu Bhai";

function processContent(htmlContent = "") {
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
      level: tagName,
    });
  });

  return {
    html: $("body").html() || "",
    toc,
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const { html: processedContent, toc } = processContent(blog.content);
  const readTime = getReadTime(blog.content);
  const description = getDescription(blog);
  const canonicalUrl = `${SITE_URL}${getBlogPath(blog)}`;
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
      name: "rimubhai",
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
          className="-ml-4 text-muted-foreground rounded transition-colors hover:text-foreground"
        >
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="min-w-0 lg:col-span-4">
          <BlogTOC toc={toc} />
        </aside>

        <div className="min-w-0 lg:col-span-8">
          <header className="mb-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
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
      </div>
    </Container>
  );
}
