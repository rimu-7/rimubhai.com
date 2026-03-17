import { getBlogBySlug, getBlogPath, getDescription } from "@/lib/blogs";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rimubhai.com";
const SITE_NAME = "rimubhai";
const AUTHOR_NAME = "Rimu Bhai";
const DEFAULT_IMAGE = `${SITE_URL}/rimu.png`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = blog.name?.trim() || "Blog";
  const description = getDescription(blog);
  const canonicalPath = getBlogPath(blog);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const image =
    blog.image && typeof blog.image === "string"
      ? blog.image.startsWith("http")
        ? blog.image
        : `${SITE_URL}${blog.image.startsWith("/") ? blog.image : `/${blog.image}`}`
      : DEFAULT_IMAGE;

  return {
    title,
    description,
    keywords: [
      "Rimu Bhai",
      "blog",
      "web development",
      "Next.js",
      "React",
      "full stack development",
      ...(title ? title.split(/\s+/).slice(0, 8) : []),
    ],
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: `${title} | Rimu Bhai`,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Rimu Bhai`,
      description,
      images: [image],
      creator: "@__rimu7_",
    },
  };
}

export default function BlogDetailsLayout({ children }) {
  return children;
}