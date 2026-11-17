import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "store.snapptrip.com",
      },
      {
        protocol: "https",
        hostname: "www.eghamat24.com",
      },
      {
        protocol: "https",
        hostname: "www.iran-booking.com",
      },
    ],
  },
};

export default nextConfig;
