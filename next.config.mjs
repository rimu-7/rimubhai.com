/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: [
      "api.microlink.io",
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "www.jsdelivr.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/stats/track.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/stats/api/send",
        destination: "https://api-gateway.umami.dev/api/send",
      },
    ];
  },
};

export default nextConfig;
