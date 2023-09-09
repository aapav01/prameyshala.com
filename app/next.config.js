/** @type {import('next').NextConfig} */
const nextConfig = {
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
