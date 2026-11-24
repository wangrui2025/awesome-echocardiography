import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://awesome-echocardiography.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
