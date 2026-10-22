import { readFileSync } from "node:fs";
import path from "node:path";
import { createHighlighter } from "shiki";
import { type ImageSource, Renderer } from "takumi-js/node";

// Fonts are registered explicitly so the output is identical on a laptop and in
// the deploy image (debian-slim), which ships no fonts. Registration order is
// the fallback chain, so Inter is the default for every card.
//
// The sans is the frozen OG cut of Inter (scripts/subset-inter.sh): takumi
// cannot apply OpenType features at render time, so cv11 (single-storey `a`)
// and ss08 (round quotes) are baked into its default glyphs, matching the site.
const fontFile = (p: string) => readFileSync(path.join(process.cwd(), p));

const takumiRenderer = new Renderer();
await takumiRenderer.registerFont(fontFile("public/fonts/og/inter-og.woff2"));
// Monospace for code-snippet cards, referenced by this exact family name.
await takumiRenderer.registerFont({
	data: fontFile(
		"node_modules/@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2",
	),
	name: "Source Code Pro",
});

/**
 * Images the cards reference by `src`. Takumi keeps no image store between
 * renders, so every render that draws the avatar must pass these.
 */
const takumiImages: ImageSource[] = [
	{ src: "avatar", data: fontFile("public/img/coffee-art.jpg") },
];

export { takumiImages, takumiRenderer };

export const highlighter = await createHighlighter({
	themes: ["github-dark"],
	langs: [
		"tsx",
		"ts",
		"sql",
		"shell",
		"js",
		"bash",
		"php",
		"html",
		"css",
		"toml",
		"yaml",
		"dockerfile",
	],
});
