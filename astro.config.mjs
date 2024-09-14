import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import remarkEmbedImages from "remark-embed-images";

import node from "@astrojs/node";
import { setLayout } from "./src/lib/remark-default-layout";

export default defineConfig({
  site: "https://andri.dk/",
  integrations: [react(), tailwind(), icon()],
  trailingSlash: "ignore",
  markdown: {
    drafts: true,
    remarkPlugins: [remarkEmbedImages, setLayout],
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-dark" },
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
    optimizeDeps: {
      exclude: ["social-cards"], // https://github.com/evanw/esbuild/issues/1051#issuecomment-1006992549
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "da", "is"],
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      is: "en",
      da: "en",
    },
  },
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
});
