"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/blogs");
        const json = await res.json();
        const featured = (json.data || [])
          .filter((b) => b.featured)
          .slice(0, 4);
        setBlogs(featured);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Skeleton Loading State
  if (loading) {
    return (
      <section className="py-10 container mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[200px] border rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="pt-4">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="py-10 container mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Featured blogs
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Curated articles handpicked just for you.
          </p>
        </div>

        <Link
          href="/blogs"
          className="group relative flex items-center text-sm font-medium hover:text-primary text-primary/80 transition-colors"
        >
          View All blogs
          <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {blogs.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
