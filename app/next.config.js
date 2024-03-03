const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: require.resolve("pdfjs-dist/build/pdf.worker.min.js"),
            to: path.join(__dirname, "public/static/js"),
          },
        ],
      }),
    )

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
