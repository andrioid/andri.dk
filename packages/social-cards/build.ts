import { Resvg, ResvgRenderOptions } from "@resvg/resvg-js";
import { Options, Result } from "./types";
import { promises } from "node:fs";
import { resolve } from "node:path";
import fontTest from "./Inter.ttf";

const defaultRsvgOptions: Partial<ResvgRenderOptions> = {
	imageRendering: 1,
	logLevel: "debug",

	font: {
		loadSystemFonts: false,

		defaultFontFamily: "Inter Thin",
		fontFiles: [fontTest],
		//defaultFontFamily: "Inter",
	},
};

const defaultOptions: Partial<Options> = {
	resvg: defaultRsvgOptions,
};

export async function generateImage(options: Options): Promise<Result> {
	options = { ...defaultOptions, ...options };
	console.log("generating", options);
	const resvg = new Resvg(options.svg, options.resvg);
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();
	console.log("parsed", resvg.toString());
	await promises.writeFile(resolve("./test-out-ori.svg"), options.svg);
	await promises.writeFile(resolve("./test-out.svg"), resvg.toString());
	await promises.writeFile(resolve("./test-out.png"), pngBuffer);

	return {
		url: "moo",
		path: "moo",
		hash: "omo",
	};
}
