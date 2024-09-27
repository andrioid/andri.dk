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
	const transformer = (_, file: AstroFile) => {
		file.data.astro.frontmatter.layout =
			file.data.astro.frontmatter.layout ?? "@layouts/MdPageLayout.astro";
	};
	return transformer;
};
