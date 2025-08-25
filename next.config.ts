import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  logging: { fetches: { fullUrl: true } },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('puppeteer');
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer'],
  },
};

export default nextConfig;
