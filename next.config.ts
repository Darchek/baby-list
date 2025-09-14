import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all https domains
      },
      {
        protocol: 'http',
        hostname: '**', // (optional) allow all http domains too
      },
    ],
  },
};

export default nextConfig;
