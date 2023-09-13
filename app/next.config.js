/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    return config;
  },
  poweredByHeader: false,
  experimental: {
    mdxRs: true,
  },
  env: {
    VERCEL_URL: 'https://prameyshala.com',
  },
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
