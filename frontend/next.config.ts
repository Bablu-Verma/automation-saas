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
    ],
  },
};

export default nextConfig;
