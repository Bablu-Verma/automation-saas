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
        hostname: "i.ibb.co",
        pathname: "/**",           
      },
    ],
  },
};

export default nextConfig;
