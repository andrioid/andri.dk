import { VFile } from "vfile";
import type { CommonBlog } from "../cms";

// This sets our default layout even if there is no frontmatter
// - Use case: Simple pages like /now or /using
interface AstroFile extends VFile {
  data: {
    astro: {
      frontmatter: CommonBlog & {
        layout?: string;
      };
    };
  };
}

export const setLayout = () => {
  const transformer = (_node: unknown, file: AstroFile) => {
    if (file.data.astro.frontmatter.slug) {
      // Not a file, but a loaded resource
      return;
    }
    file.data.astro.frontmatter.layout =
      file.data.astro.frontmatter.layout ?? "@layouts/MdPageLayout.astro";
  };
  return transformer;
};
