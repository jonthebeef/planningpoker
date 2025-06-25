/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  exportPathMap: function() {
    return {
      '/': { page: '/' }
    }
  }
}

module.exports = nextConfig 