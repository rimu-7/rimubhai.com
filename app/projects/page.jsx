import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { BlogCard } from "./BlogCard";
import Container from "../../components/Container";

// Server Component Fetching (Better for SEO)
async function getBlogs() {
  await connectDB();
  // Fetch all, sorted by newest
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  // Convert _id and dates to strings for Next.js hydration
  return JSON.parse(JSON.stringify(blogs));
}

export default async function AllBlogsPage() {
  const blogs = await getBlogs();

  return (
    <Container>
      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className=" mx-auto space-y-4">
          <h1 className="text-4xl justify-start font-extrabold tracking-tight lg:text-5xl">
            my blogs
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, tutorials, and insights about development and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </Container>
  );
}
