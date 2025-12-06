import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rs5fueefxc.ufs.sh",
        pathname: "**",
      },
    ]
  }


};

export default nextConfig;
