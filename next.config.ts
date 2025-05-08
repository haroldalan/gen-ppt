import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aleph-ppt-output.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/runs/**',
      },
    ],
  },
};

export default nextConfig;
