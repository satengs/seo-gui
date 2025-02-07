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
      'cfd11d2f153d6efd7d070572120621a942d1068dab72e65e205b1d3fda42c382',
  },
};

module.exports = nextConfig;
