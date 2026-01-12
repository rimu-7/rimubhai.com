import Container from "@/components/Container";
import { BlogCard } from "./BlogCard"; // Adjust import path
import { getBlogs } from "@/lib/data";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Blogs",
  description: "Insights, tutorials, and thoughts on web development.",
};

export default async function AllBlogsPage() {
  const blogs = await getBlogs();

  return (
    <Container>
      <div className="py-16 space-y-12 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize">
            The Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Thoughts, tutorials, and insights about full-stack development, system design, and the tech industry.
          </p>
        </div>

        {/* Content Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-dashed border-2 rounded-xl bg-muted/30">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No posts published yet.</p>
            <p className="text-sm">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </Container>
  );
}