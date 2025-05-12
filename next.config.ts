import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["antd", "@ant-design/icons"]
};

export default nextConfig;
