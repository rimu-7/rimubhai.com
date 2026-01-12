"use client";

import Link from "next/link";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Star, Clock } from "lucide-react";

export function BlogCard({ post }) {
  // Simple reading time estimate (200 words per minute)
  // We strip HTML tags to count actual words
  const wordCount =
    post.content?.replace(/<[^>]*>?/gm, "").split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <Link
      href={`/blogs/${post._id}`}
      className="block h-full outline-none group"
    >
      <Card className="flex flex-col h-full shadow-none border-none hover:outline-2 bg-card text-card-foreground transition-all duration-300 hover:border-primary/50 overflow-hidden">
        {/* Optional: Add an Image here if your schema supports it */}
        {/* <div className="aspect-video w-full bg-muted" /> */}

        <CardHeader className="flex-1 space-y-4 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {post.featured && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 gap-1"
                >
                  <Star className="w-3 h-3 fill-primary" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium shrink-0">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {post.formattedDate}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.name}
            </h3>

            {/* Show a short plain-text snippet */}
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {post.content?.replace(/<[^>]*>?/gm, "").substring(0, 150)}...
            </p>
          </div>
        </CardHeader>

        <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground/80">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime} min read</span>
          </div>

          <div className="relative inline-flex items-center gap-1 font-medium text-primary">
            Read Article
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
