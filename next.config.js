/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable image optimization since we're running locally
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 