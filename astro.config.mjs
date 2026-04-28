// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    maxDuration: 30,
  }),
  image: {
    domains: ['api.ankor.io', 'api.ankor.dev'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
