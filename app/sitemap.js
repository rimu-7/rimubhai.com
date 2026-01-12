export default function sitemap() {
  const baseUrl = "https://rimubhai.com";

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), priority: 0.8 },
  ];
}
