"use client";
import Link from "next/link";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Star } from "lucide-react";
import { useState, useEffect } from "react";

export function BlogCard({ post }) {
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by only rendering date after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link href={`/blogs/${post._id}`} className="block h-full outline-none">
      <Card className="group flex flex-col h-full border bg-card text-card-foreground transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            {post.featured ? (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors gap-1 pr-2.5"
              >
                <Star className="w-3 h-3 fill-primary text-primary" />
                Featured
              </Badge>
            ) : (
              // Spacer to keep layout consistent if mixed content
              <div className="h-5" />
            )}

            <span className="text-xs font-medium text-muted-foreground flex items-center shrink-0 bg-muted/50 px-2 py-1 rounded-md">
              <Calendar className="w-3 h-3 mr-1.5" />
              {mounted ? formatDate(post.createdAt) : "Loading..."}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.name}
          </h3>

          {/* Optional: If you have a description/excerpt, add it here */}
          {/* <p className="text-muted-foreground line-clamp-2 text-sm">
             {post.description}
          </p> */}
        </CardHeader>

        <CardFooter className="pt-0 pb-6">
          <div className="relative inline-flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              Read Article
            </span>
            <ArrowRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />

            {/* The Hover Underline */}
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
