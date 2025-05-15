/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.shopify.com', 'cdn.shopifycdn.net'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  }
}

export default nextConfig;
