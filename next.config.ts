import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Static export configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'animeshpandey.com',
      },
      {
        protocol: 'https',
        hostname: 'd1iukwsziul56d.cloudfront.net',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Optimize bundle size and reduce HTTP requests
  experimental: {
    optimizePackageImports: ['@/components', '@/lib', '@/hooks'],
  },

  // Compress responses
  compress: true,

  // Headers for security and performance (will be handled by hosting provider)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets for better performance
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        source: '/:path*\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    ];
  },

  // Redirects for SEO (will be handled by hosting provider)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Webpack configuration for static export
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },

  // ESLint configuration - disable during builds to avoid compatibility issues
  // ESLint is still run separately via `npm run lint` in CI pipeline
  eslint: {
    // Disable ESLint during build to avoid deprecated options error
    // ESLint is run separately in CI, so code quality is still maintained
    ignoreDuringBuilds: true,
  },

  // Disable server-side features
  serverExternalPackages: [],
};

export default nextConfig;
