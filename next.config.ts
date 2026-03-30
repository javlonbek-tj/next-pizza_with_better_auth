/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
