export const revalidate = 300;

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar, Clock, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container";
import { HoverUnderline } from "@/components/HoverUnderline";
import { getBlogs, getBlogPath, getReadTime, stripHtml } from "@/lib/blogs";

function getPreviewText(html = "", maxLength = 150) {
  const plainText = stripHtml(html);
  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
}

export default async function BlogListingPage() {
  const blogs = await getBlogs();

  return (
    <Container>
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Latest Insights
        </h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, ideas, and stories from our team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogs?.map((blog) => {
          const previewText = getPreviewText(blog.content);
          const readTime = getReadTime(blog.content);

          return (
            <Link
              href={getBlogPath(blog)}
              key={blog._id}
              className="group h-full"
            >
              <Card className="flex h-full flex-col rounded border bg-transparent transition-all duration-300 hover:outline-2">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {blog.createdAt
                        ? format(new Date(blog.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </div>

                    {blog.featured && (
                      <Badge
                        variant="secondary"
                        className="rounded text-foreground"
                      >
                        <Star className="mr-1 h-3.5 w-3.5 fill-foreground" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="line-clamp-2 text-xl leading-tight transition-colors group-hover:text-primary">
                    {blog.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {previewText}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t bg-muted/5 pt-4">
                  <span className="relative flex items-center gap-2 text-sm font-medium text-primary">
                    <HoverUnderline>Read Article</HoverUnderline>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>

                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {readTime} min read
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}

        {(!blogs || blogs.length === 0) && (
          <div className="col-span-full rounded-lg border border-dashed bg-muted/10 py-20 text-center text-muted-foreground">
            <p>No blogs found.</p>
          </div>
        )}
      </div>
    </Container>
  );
}