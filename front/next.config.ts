import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    reactRefresh: false, // Disables Hot Reload (Fast Refresh)
  },
};

export default nextConfig;