import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://madelgeek.com',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    cacheDir: "./.cache/image",
    logLevel: 'error',
  },
  integrations: [mdx(), sitemap(), tailwind()]
});