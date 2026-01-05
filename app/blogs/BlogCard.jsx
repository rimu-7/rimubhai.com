"use client";
import Link from "next/link";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export function BlogCard({ post }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, [post.createdAt]);

  return (
    <Link href={`/blogs/${post._id}`} className="hover:no-underline block">
      <Card className="group flex flex-col h-full border hover:shadow-md hover:outline-2 hover:border-foreground transition-all duration-300 overflow-hidden">
        <CardHeader className="">
          <div className="flex justify-between items-start gap-2 mb-2">
            {post.featured && (
              <Badge variant="secondary" className="hover:text-yellow-400">
                Featured <Star />
              </Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center ml-auto">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate ||
                // Fallback during SSR or initial render
                new Date(post.createdAt).toISOString().split("T")[0]}
            </span>
          </div>

          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.name}
          </h3>
        </CardHeader>

        <CardFooter className="pt-0 pb-6">
          <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Read Article <ArrowRight className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
