"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "./BlogCard";

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

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!blogs.length) return null;

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Stories
          </h2>
          <p className="text-muted-foreground ">
            Curated articles just for you.
          </p>
        </div>
        <div className="relative flex gap-2 group">
          <Link href="/blogs" className="relative flex gap-2 items-center">
            View All <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
          </Link>
        </div>
        
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
