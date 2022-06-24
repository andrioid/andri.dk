import { Resvg, ResvgRenderOptions } from "@resvg/resvg-js";
import { Options, Result } from "./types";
import { promises } from "node:fs";
import { resolve } from "node:path";

export const fontPath = resolve("../social-cards", "fonts");

export const defaultRsvgOptions: Partial<ResvgRenderOptions> = {
	imageRendering: 1,
	logLevel: "debug",
	font: {
		loadSystemFonts: false,
		fontDirs: [fontPath],
	},
};

const defaultOptions: Partial<Options> = {
	resvg: defaultRsvgOptions,
};

export async function generateImage(options: Options): Promise<Result> {
	options = { ...defaultOptions, ...options };
	const resvg = new Resvg(options.svg, options.resvg);
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();
	await promises.writeFile(resolve("./test-out-ori.svg"), options.svg);
	await promises.writeFile(resolve("./test-out.svg"), resvg.toString());
	await promises.writeFile(resolve("./test-out.png"), pngBuffer);

	return {
		url: "moo",
		path: "moo",
		hash: "omo",
	};
}
