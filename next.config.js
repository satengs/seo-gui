/** @type {import('next').NextConfig} */
// const nextConfig = {
//   // output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
//   env: {
//     NEXT_CONFIG_BASE_API_URL: 'http://localhost:3000',
//     SERP_API_KEY:
//       'cfd11d2f153d6efd7d070572120621a942d1068dab72e65e205b1d3fda42c382',
//   },
// };
//
// module.exports = nextConfig;

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    SERP_API_KEY: process.env.SERP_API_KEY,
    BASE_API_URL: process.env.BASE_API_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },

  webpack: (config) => {
    config.externals = [...config.externals, 'mongoose'];
    return config;
  },
};

module.exports = nextConfig;
