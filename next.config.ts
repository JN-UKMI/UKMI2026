import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  // Disable source maps in development to reduce memory usage significantly
  // Source maps for a project this size can consume 2-4GB of memory on their own
  experimental: {
    // Turbopack is already the default in Next.js 16 dev, but be explicit
  },
};

export default nextConfig;
