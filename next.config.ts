import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "m.media-amazon.com" },
      { hostname: "images-na.ssl-images-amazon.com" },
    ],
  },
};

export default nextConfig;
