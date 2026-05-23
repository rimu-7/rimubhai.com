import { getBlogs, getBlogPath } from "@/lib/blogs";

export default async function sitemap() {
  const baseUrl = "https://rimubhai.com";
  const blogs = await getBlogs();

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}${getBlogPath(blog)}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), priority: 0.8 },
    ...blogUrls,
  ];
}
