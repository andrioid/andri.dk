import { Resvg, ResvgRenderOptions } from "@resvg/resvg-js";
import { Options, Result } from "./types";
import { promises, existsSync } from "node:fs";
import { resolve } from "node:path";

export const fontPath = resolve("static", "fonts");

export const defaultRsvgOptions: Partial<ResvgRenderOptions> = {
	logLevel: "debug",
	font: {
		loadSystemFonts: true,
		fontDirs: ["static/fonts"],
		defaultFontFamily: "Montserrat",
	},
};

export const defaultOptions: Partial<Options> = {
	resvg: defaultRsvgOptions,
	outputDir: "public/social-cards",
	urlPath: "/",
	publicDir: "public",
};

export async function generateImage(options: Options): Promise<Result> {
	options = { ...defaultOptions, ...options };
	await promises.writeFile(resolve("./test-out-ori.svg"), options.svg);
	const resvg = new Resvg(options.svg, options.resvg);
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();
	await promises.writeFile(resolve("./test-out.svg"), resvg.toString());
	await promises.writeFile(resolve("./test-out.png"), pngBuffer);

	return {
		url: "moo",
		path: "moo",
		hash: "omo",
	};
}

export function validateImage(image: string): string {
	if (image.indexOf("/") === 0) {
		image = image.substring(1);
	}

	const imagePath = resolve(".", image);
	//console.log("Validating", image, imagePath);

	if (!existsSync(imagePath)) {
		throw new Error(
			"[social-cards] image defined, but does not exist: " + imagePath
		);
	}
	return imagePath;
}
