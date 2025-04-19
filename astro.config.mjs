import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig, envField } from "astro/config";
import remarkEmbedImages from "remark-embed-images";
import { setLayout } from "./src/lib/remark-default-layout";

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
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  env: {
    schema: {
      MODEL_BOX_API_KEY: envField.string({ context: "server", access: "public"})
    }
  }
});
