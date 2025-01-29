/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_CONFIG_BASE_API_URL: 'http://localhost:3000',
    SERP_API_KEY:
      '3e06e7de164422f03a7e8ae9a759e0259d7821ad554a7c8b07c73f14e0aaa38e',
  },
};

module.exports = nextConfig;
