/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@electrum/ui', '@electrum/shared', '@electrum/auth'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig