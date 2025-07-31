import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  logging: { fetches: { fullUrl: true } },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;
