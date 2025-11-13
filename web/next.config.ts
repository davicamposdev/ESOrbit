import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fortnite-api.com",
      },
    ],
  },
};

export default nextConfig;
