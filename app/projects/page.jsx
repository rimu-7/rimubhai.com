import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";
import { BlogCard } from "./BlogCard";
import Container from "../../components/Container";

async function getBlogs() {
  await connectDB();
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

export default async function AllBlogsPage() {
  const blogs = await getBlogs();

  return (
    <Container>
      <section className="py-16 md:py-20">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            my blogs
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Thoughts, tutorials, and insights about development and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </Container>
  );
}
