import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://kthyon.github.io',
  base: '/portafolio',
  trailingSlash: 'always',
  integrations: [react(), tailwind()],
});
