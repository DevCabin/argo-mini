/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server-side features
  experimental: {
    serverActions: true,
  },
  // Configure API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Disable image optimization since we're running locally
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 