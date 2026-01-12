export default function manifest() {
  return {
    name: 'Rimu Bhai Portfolio',
    short_name: 'Rimu Bhai',
    description: 'Full Stack Developer Portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}