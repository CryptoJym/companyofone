import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'utlyze.com', 'companyofone.ai'],
  },
  // Vercel deployment optimizations
  output: 'standalone',
  // API rewrites for backend integration
  async rewrites() {
    return [
      {
        source: '/api/v1/ai-assistant/:path*',
        destination: 'http://localhost:3001/api/v1/ai-assistant/:path*'
      }
    ]
  },
  // SEO optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
