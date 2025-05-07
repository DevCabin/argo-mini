/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static exports for standalone deployment
  output: 'export',
  // Disable image optimization since we're running locally
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 