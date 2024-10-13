import { VFile } from "vfile";

// This sets our default layout even if there is no frontmatter
// - Use case: Simple pages like /now or /using
type MarkdownFileFrontmatter = {
  layout?: string;
  title: string;
  description?: string;
};
interface AstroFile extends VFile {
  data: {
    astro: {
      frontmatter: MarkdownFileFrontmatter;
    };
  };
}

export const setLayout = () => {
  const transformer = (_node: unknown, file: AstroFile) => {
    const filePath = file.history[0];
    if (filePath.match(/src\/pages\//i)) {
      file.data.astro.frontmatter.layout =
        file.data.astro.frontmatter.layout ?? "@layouts/MdPageLayout.astro";
    }
    // We can  add additional automatic layouts here.
    // For now, I like that the astro pages dictate layout for blog posts
  };
  return transformer;
};
