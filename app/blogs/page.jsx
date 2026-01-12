export const dynamic = "force-dynamic";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar, Clock } from "lucide-react"; // Added Clock
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import Container from "@/components/Container";
import { Star } from "lucide-react";

// Helper: Strip HTML tags to create a clean text preview
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("❌ DB Error:", error);
    return [];
  }
}

export default async function BlogListingPage() {
  const blogs = await getBlogs();

  return (
    <Container>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Latest Insights
        </h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, ideas, and stories from our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs?.map((blog) => {
          // 1. Get plain text for preview AND reading time
          const plainText = stripHtml(blog.content);

          // 2. Create Preview
          const previewText = plainText.substring(0, 150) + "...";

          // 3. Calculate Reading Time
          const words = plainText.split(/\s+/).length;
          const readTime = Math.ceil(words / 200);

          return (
            <Link
              href={`/blogs/${blog._id}`}
              key={blog._id}
              className="group h-full"
            >
              <Card className="h-full flex flex-col transition-all border duration-300 hover:outline-2 bg-transparent rounded">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Calendar className="w-3 h-3" />
                      {blog.createdAt
                        ? format(new Date(blog.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </div>
                    {blog.featured && (
                      <Badge
                        variant="secondary"
                        className="rounded text-foreground fill-background"
                      >
                        <Star className="fill-foreground" /> Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {blog.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {previewText}
                  </p>
                </CardContent>

                {/* Updated Footer with Justify Between */}
                <CardFooter className="pt-4 border-t bg-muted/5 flex items-center justify-between">
                  <span className="flex gap-2 relative items-center text-sm font-medium text-primary">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <span className="absolute left-0 bottom-0 h-[1.5px] w-full bg-foreground scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                  </span>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime} min read
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}

        {(!blogs || blogs.length === 0) && (
          <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
            <p>No blogs found.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
