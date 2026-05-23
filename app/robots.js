export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/_next/image*',
        '/api/about',
        '/api/awards',
        '/api/experience',
        '/api/life-events',
        '/api/projects',
        '/api/blogs',
      ],
      disallow: [
        '/api/',
        '/dashboard/',
        '/*?*', // Prevent indexing of search/filter params
      ],
    },
    sitemap: 'https://rimubhai.com/sitemap.xml',
  }
}