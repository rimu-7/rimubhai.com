import {
  AUTHOR_NAME,
  AUTHOR_TWITTER,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  getBlogById,
  getBlogCanonicalPath,
  getBlogDescription,
  getBlogImage,
  getBlogKeywords,
  getModifiedIso,
  getPublishedIso,
} from "@/lib/blog-seo";

/** @type {import("next").Metadata} */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);

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
  const description = getBlogDescription(blog);
  const canonicalPath = getBlogCanonicalPath(blog);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const image = getBlogImage(blog);
  const publishedTime = getPublishedIso(blog);
  const modifiedTime = getModifiedIso(blog);

  return {
    title,
    description,
    keywords: getBlogKeywords(blog),

    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    creator: "Rimu Bhai",
    publisher: "Rimu Bhai",

    alternates: {
      canonical: canonicalPath,
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
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
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime,
      modifiedTime,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: image || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: AUTHOR_TWITTER,
      images: [image || DEFAULT_OG_IMAGE],
    },
  };
}

export default function BlogDetailsLayout({ children }) {
  return children;
}