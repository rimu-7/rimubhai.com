export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/auth/'], // Hide sensitive routes
    },
    sitemap: 'https://rimubhai.com/sitemap.xml',
  }
}