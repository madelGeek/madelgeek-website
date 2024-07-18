import { defineConfig, squooshImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: 'https://madelgeek.com',
  image: {
    service: squooshImageService(),
      cacheDir: "./.cache/image",
      logLevel: 'error',
  },
  integrations: [mdx(), sitemap(), tailwind()]
});