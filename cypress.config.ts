import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  },
});
