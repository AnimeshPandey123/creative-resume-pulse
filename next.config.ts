import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Enable React strict mode for better development
    reactStrictMode: true,

    // Development configuration (no static export)
    images: {
        domains: [
            'animeshpandey.com',
            'd1iukwsziul56d.cloudfront.net',
            'dev-to-uploads.s3.amazonaws.com'
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Headers for security and performance
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
        ];
    },

    // Redirects for SEO
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ];
    },

    // Webpack configuration
    webpack: (config, { isServer, dev }) => {
        // Optimize bundle size
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }

        // Fix chunk loading issues
        if (!isServer && !dev) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // Common chunk
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                    },
                },
            };
        }

        return config;
    },

    // TypeScript configuration
    typescript: {
        // Enable type checking during build
        ignoreBuildErrors: false,
    },

    // ESLint configuration
    eslint: {
        // Disable ESLint during build
        ignoreDuringBuilds: true,
    },

    // Disable server-side features
    serverExternalPackages: [],
};

export default nextConfig; 