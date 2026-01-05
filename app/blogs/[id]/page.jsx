import connectDB from "@/lib/mongodb";
import { Blog, User } from "@/lib/schema"; // Import User to populate author if needed
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User as UserIcon } from "lucide-react";
import Link from "next/link";

async function getBlogPost(id) {
  try {
    await connectDB();
    const post = await Blog.findById(id).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) notFound();

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        asChild
        className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
      >
        <Link href="/blogs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      {/* Header */}
      <header className="space-y-6 mb-10 border-b pb-10">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {/* If you populated user */}
          {/* <span className="flex items-center">
            <UserIcon className="w-4 h-4 mr-1" />
            {post.userId?.name || "Admin"}
          </span> */}
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl leading-tight">
          {post.name}
        </h1>
      </header>

      {/* Content Body */}
      {/* IMPORTANT: 'prose' comes from @tailwindcss/typography plugin.
         It makes the raw HTML look beautiful automatically.
      */}
      <div
        className="
          prose prose-neutral dark:prose-invert max-w-none 
          prose-lg leading-relaxed
          prose-headings:font-bold prose-headings:text-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
        "
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
