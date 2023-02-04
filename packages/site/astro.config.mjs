import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkEmbedImages from "remark-embed-images";
import deno from "@astrojs/deno";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://andri.dk/",
  integrations: [
    react(),
    tailwind(),
    mdx({
      drafts: true,
    }),
  ],
  trailingSlash: "ignore",
  markdown: {
    drafts: true,
    remarkPlugins: [remarkEmbedImages],
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
  output: "server",
  adapter: deno(),
  // adapter: node({
  //   mode: "standalone",
  // }),
});
