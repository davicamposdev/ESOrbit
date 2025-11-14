import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
