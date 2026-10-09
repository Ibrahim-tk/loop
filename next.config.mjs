/** @type {import('next').NextConfig} */
const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.buildium.com https://*.managebuilding.com https://*.amazonaws.com",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; '),
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    },
];

const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'vsoofaltxwlrvmfdcspn.supabase.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Compress output for smaller Vercel deployment
    compress: true,
    // Power optimizations
    poweredByHeader: false,
    // Strict React mode for catching bugs
    reactStrictMode: true,
    // Production source maps off to reduce bundle
    productionBrowserSourceMaps: false,
    compiler: {
        // Remove console.log in production builds
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['warn', 'error'] } : false,
    },
    webpack: (config) => {
        // Suppress webpack cache serialization warning for framework strings >128KB
        config.infrastructureLogging = {
            ...config.infrastructureLogging,
            level: 'error',
        };
        return config;
    },
};

export default nextConfig;
