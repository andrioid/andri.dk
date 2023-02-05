import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkEmbedImages from "remark-embed-images";

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
    optimizeDeps: {
      exclude: ["social-cards"], // https://github.com/evanw/esbuild/issues/1051#issuecomment-1006992549
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
