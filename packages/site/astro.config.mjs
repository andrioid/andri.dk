import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkEmbedImages from "remark-embed-images";

export default defineConfig({
  site: "https://andri.dk/",
  integrations: [
    react(),
    tailwind(),
    mdx({
      drafts: true,
    }),
  ],
  trailingSlash: "always",
  vite: {
    ssr: {
      external: ["svgo"], // workaround for astro-icon
    },
  },

  markdown: {
    drafts: true,
    remarkPlugins: [remarkEmbedImages],
  },
});
