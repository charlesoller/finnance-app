/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  env: {
    STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
  },
};

export default nextConfig;
