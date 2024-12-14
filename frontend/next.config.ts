import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  env: {
    CUSTOM_API_URL: process.env.CUSTOM_API_URL || 'http://localhost:3000/api',
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'example.com',
      'img.icons8.com',
      'www.trumba.com',
      'usercontent.one',
      'festivalsforall.s3.eu-west-1.amazonaws.com',
      'cdn.britannica.com',
      'pbs.twimg.com',
      'static.thehoneycombers.com',
      'images.squarespace-cdn.com',
      'secureparking.co.id',
      'images.stockcake.com',
      'discoveryourindonesia.com',
      'img.jakpost.net',
      'cdn.wallpapersafari.com',
      'deadline.com',
      'wordpress.com',
      'cdn1-production-images-kly.akamaized.net',
      'people.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Security header
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    // Customize webpack configuration if necessary
    if (!isServer) {
      config.resolve.fallback = { fs: false }; // Handle 'fs' module in the browser
    }
    return config;
  },
  eslint: {
    // Disable ESLint during the build process
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
