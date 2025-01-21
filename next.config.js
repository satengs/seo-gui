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
      'c7e70b5e48ae3f660e05469594303f53af1daece547122a6682a33a9f6ce9da7',
  },
};

module.exports = nextConfig;
