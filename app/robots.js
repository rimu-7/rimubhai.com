export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/*?*', // Prevent indexing of search/filter params
      ],
    },
    sitemap: 'https://rimubhai.com/sitemap.xml',
  }
}