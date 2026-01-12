import connectDB from "@/lib/mongodb";
import { Blog } from "@/lib/schema";

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Connect to DB directly (Fastest method)
    await connectDB();
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return {
        title: "Blog Not Found",
        description: "The requested article could not be found.",
      };
    }

    // Create a clean description from the HTML content
    const plainText = blog.content.replace(/<[^>]*>?/gm, "");
    const description = plainText.substring(0, 160) + "...";

    return {
      title: `${blog.name} | rimubhai`,
      description: description,

      // Open Graph (Facebook, LinkedIn, WhatsApp)
      openGraph: {
        title: blog.name,
        description: description,
        type: "article",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/blogs/${blog._id}`,
        // If you have an image field, use it here:
        // images: [{ url: blog.image || '/default-blog.jpg' }],
        siteName: "rimubhai",
        publishedTime: blog.createdAt,
        authors: ["rimubhai"],
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: blog.name,
        description: description,
        // images: [blog.image || '/default-blog.jpg'],
      },
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: "Blog | rimubhai",
    };
  }
}

// 2. The Layout Component
export default function BlogsByIDLayout({ children }) {
  return (
    <>
      {/* You can add specific layout elements for blog details here 
         (e.g., a reading progress bar), but usually, a simple wrapper is fine. 
      */}
      {children}
    </>
  );
}
