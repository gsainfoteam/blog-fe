import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["prod-files-secure.s3.us-west-2.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main/all",
        permanent: true,
      },
      {
        source: "/main",
        destination: "/main/all",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
