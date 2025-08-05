import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  logging: { fetches: { fullUrl: true } },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
};

export default nextConfig;
