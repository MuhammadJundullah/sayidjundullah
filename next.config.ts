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
        hostname: "lookerstudio.google.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "app.powerbi.com",
      },
      {
        protocol: "https",
        hostname: "lookerstudio.google.com",
      },
      {
        protocol: "https",
        hostname: "public.tableau.com",
      },
    ],
  },
};

export default nextConfig;


