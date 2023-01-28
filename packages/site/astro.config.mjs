import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
//import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
export default defineConfig({
  site: "https://andri.dk/",
  integrations: [
    react(),
    tailwind(),
    //astroImageTools // too heavy to use
  ],
  trailingSlash: "always",
  vite: {
    ssr: {
      external: ["svgo"], // workaround for astro-icon
    },
  },
  markdown: {
    remarkPlugins: ["remark-embed-images"],
  },
});
