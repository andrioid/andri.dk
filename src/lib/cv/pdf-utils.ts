import { Font, renderToBuffer } from "@react-pdf/renderer";

import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { DEFAULT_FONT, type Resume } from "./";
import { colors } from "./colors";
import { CVWrapper } from "./react/cv-wrapper";

// PDF can only be generated server-side (import doesnt work well with this)
export const STATIC_DIR = path.join(process.cwd(), "public");

function fixFontImport(imp: string): string {
	const out = path.join(STATIC_DIR, "fonts/pdf", imp);
	if (!fs.existsSync(out)) {
		throw new Error("Font not found: " + out);
	}
	return out;
}

export function registerFonts() {
	Font.registerHyphenationCallback((word) => [word]);

	try {
		Font.register({
			family: DEFAULT_FONT,
			// Order matters. react-pdf resolves an unregistered weight by
			// walking these in registration order, so `fontWeight: 500` on the
			// name lands on the last entry at or below 500 — Light. Reordering
			// this list silently restyles the name.
			fonts: [
				{
					src: fixFontImport("Inter-Regular.ttf"),
				},
				{
					// SemiBold fills the bold slot, as Montserrat's did before
					// it: real Inter Bold is too heavy for a page this dense.
					src: fixFontImport("Inter-SemiBold.ttf"),
					fontWeight: 700,
				},
				{
					src: fixFontImport("Inter-Light.ttf"),
					fontWeight: 300,
				},
				{
					src: fixFontImport("Inter-Italic.ttf"),
					fontStyle: "italic",
				},
			],
		});

		Font.register({
			family: "Brands",
			src: fixFontImport("brands.ttf"),
		});
		Font.register({
			family: "Awesome",
			src: fixFontImport("awesome-solid.ttf"),
		});
	} catch {
		console.error("WTF");
	}
}

export async function resumeToString(resume: Resume) {
	registerFonts();
	const cvDoc = createElement(CVWrapper, { resume: resume });
	return renderToBuffer(cvDoc as any);
}

export function getColor(name: keyof typeof colors | string): string {
	return colors[name as keyof typeof colors];
}
