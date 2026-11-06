import { readFileSync } from "node:fs";
import path from "node:path";
import {
	type BundledLanguage,
	bundledLanguages,
	createHighlighter,
} from "shiki";
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

/**
 * Output size for every social card. Layouts are designed on a 1200x630 CSS
 * canvas and rendered at 2x, so text stays sharp when LinkedIn or a high-DPI
 * screen scales the image up. Keep in sync with og:image:width/height in
 * Layout.astro.
 */
const OG_IMAGE_SIZE = { width: 2400, height: 1260, devicePixelRatio: 2 };

export { OG_IMAGE_SIZE, takumiImages, takumiRenderer };

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

/**
 * Loads a fence language from markdown into the highlighter on demand.
 * Unknown languages fall back to plain text instead of throwing.
 */
export async function loadLang(
	lang: string,
): Promise<BundledLanguage | "text"> {
	if (!(lang in bundledLanguages)) return "text";
	await highlighter.loadLanguage(lang as BundledLanguage);
	return lang as BundledLanguage;
}
