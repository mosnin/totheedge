import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.createporn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
