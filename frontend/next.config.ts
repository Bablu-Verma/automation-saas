import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
     remotePatterns: [
      {
        protocol: "http",         
        hostname: "localhost",
        port: "4800",
        pathname: "/**",           
      },
      {
        protocol: "https",         
        hostname: "res.cloudinary.com",
        pathname: "/**",           
      },
    ],
  },
};

export default nextConfig;
