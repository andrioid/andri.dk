import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import remarkEmbedImages from "remark-embed-images";
import bun from "@nurodev/astro-bun";
import node from "@astrojs/node";
import { setLayout } from "./src/lib/remark-default-layout";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://andri.dk/",
  integrations: [react(), mdx(), tailwind(), icon(), sitemap()],
  trailingSlash: "ignore",
  markdown: {
    drafts: true,
    remarkPlugins: [remarkEmbedImages, setLayout],
    shikiConfig: { theme: "github-dark" },
  },
  vite: {
    ssr: {
      external: ["svgo", "@react-pdf/renderer"],
      noExternal: ["path-to-regexp"],
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
  output: "server", // hybrid later
  adapter: node({
    mode: "middleware",
  }),
});
