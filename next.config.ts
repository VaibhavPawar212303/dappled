import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rs5fueefxc.ufs.sh",
      },
    ],
  }


};

export default nextConfig;
