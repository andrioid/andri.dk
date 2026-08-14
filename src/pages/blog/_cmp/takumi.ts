import { Renderer } from "@takumi-rs/core";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createHighlighter } from "shiki";

// Fonts are loaded explicitly and default-font loading is turned OFF, because
// takumi otherwise renders with whatever fonts the host OS provides — and the
// deploy image (debian-slim) ships none, so every card came out as a bare
// gradient with invisible text. Loading the fonts here makes the output
// identical on a laptop and in the container.
//
// The sans is the frozen OG cut of Inter (scripts/subset-inter.sh): takumi
// cannot apply OpenType features at render time, so cv11 (single-storey `a`)
// and ss08 (round quotes) are baked into its default glyphs, matching the site.
const fontFile = (p: string) => readFileSync(path.join(process.cwd(), p));

const takumiRenderer = new Renderer({
	loadDefaultFonts: false,
	persistentImages: [
		{
			src: "avatar",
			data: fontFile("public/img/coffee-art.jpg"),
		},
	],
	fonts: [
		// Default sans for every card's prose.
		fontFile("public/fonts/og/inter-og.woff2"),
		// Monospace for code-snippet cards, referenced by this exact family name
		// (takumi ignores the generic `monospace` keyword — it needs a real name).
		{
			data: fontFile(
				"node_modules/@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2",
			),
			name: "Source Code Pro",
		},
	],
});

export { takumiRenderer };

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
