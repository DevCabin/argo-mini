/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add support for loading WebAssembly modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    return config
  },
  // Enable static exports for standalone deployment
  output: 'export',
  // Disable image optimization since we're running locally
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 