import { getBlogPost } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify"; // Import sanitizer
import Container from "@/components/Container";

// --- GENERATE METADATA ---
export async function generateMetadata({ params }) {
  const { id } = params;
  const post = await getBlogPost(id);

  if (!post) {
    return { title: "Post Not Found" };
  }

  // Create a clean summary for SEO
  const plainText = post.content?.replace(/<[^>]*>?/gm, "") || "";
  const summary = plainText.substring(0, 160).trim();

  return {
    title: post.name,
    description: summary,
    openGraph: {
      title: post.name,
      description: summary,
      type: "article",
      publishedTime: post.createdAt,
      authors: ["Rimu Bhai"], // Replace with dynamic author if available
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description: summary,
    },
  };
}

// --- MAIN PAGE COMPONENT ---
export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) notFound();

  // 1. Sanitize Content (Security Best Practice)
  // This removes <script> tags and other malicious vectors from the HTML
  const sanitizedContent = DOMPurify.sanitize(post.content);

  // 2. Calculate Reading Time
  const wordCount = post.content?.replace(/<[^>]*>?/gm, "").split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <Container>
      <article className="py-16 max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Button
          variant="ghost"
          asChild
          className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
        >
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
          </Link>
        </Button>

        {/* Article Header */}
        <header className="space-y-6 mb-12 border-b border-border/40 pb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center bg-muted/50 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 mr-2 opacity-70" />
              {post.formattedDate}
            </span>
            <span className="flex items-center bg-muted/50 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 mr-2 opacity-70" />
              {readTime} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {post.name}
          </h1>
        </header>

        {/* Article Body */}
        <div
          className="
            prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-muted-foreground/90
            prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-img:rounded-xl prose-img:border prose-img:shadow-md
            prose-hr:border-border
          "
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Footer / Share (Optional) */}
        <div className="mt-16 pt-8 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Thanks for reading!
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share this post
          </Button>
        </div>
      </article>
    </Container>
  );
}