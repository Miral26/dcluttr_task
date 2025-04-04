import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => [
    {
      source: "/channels/quick-commerce",
      destination: "/",
    },
  ],
  redirects: async () => [
    {
      source: "/",
      destination: "/channels/quick-commerce",
      permanent: false,
    },
  ],
};

export default nextConfig;
