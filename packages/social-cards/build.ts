import { Resvg, ResvgRenderOptions } from "@resvg/resvg-js";
import { Options, Result } from "./types";
import { promises, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

export const fontPath = resolve("static", "fonts");

export const defaultRsvgOptions: Partial<ResvgRenderOptions> = {
	//logLevel: "debug",
	font: {
		loadSystemFonts: true,
		fontDirs: ["static/fonts"],
		defaultFontFamily: "Montserrat",
	},
};

export const defaultOptions: Partial<Options> = {
	resvg: defaultRsvgOptions,
	outputDir: "public/social-cards",
	urlPath: "/social-cards",
	publicDir: "public",
};

export async function generateImage(options: Options): Promise<Result> {
	options = { ...defaultOptions, ...options };
	await promises.writeFile(resolve("./test-out-ori.svg"), options.svg);
	try {
		const resvg = new Resvg(options.svg, options.resvg);
		const pngData = resvg.render();
		const pngBuffer = pngData.asPng();

		if (!existsSync(options.outputDir)) {
			mkdirSync(options.outputDir, { recursive: true });
		}
		// Ready to write
		if (!options.hash) {
			throw new Error("[social-cards] No hash received from template");
		}
		const out = {
			url: join(options.urlPath, `${options.hash}.png`),
			path: join(options.outputDir, `${options.hash}.png`),
			hash: options.hash,
		};
		if (existsSync(out.path)) {
			console.debug(`[social-cards] Skipping ${out.path}`);
			return out; // No need to generate anything
		}
		console.debug(`[social-cards] Generating ${out.path}`);
		await promises.writeFile(resolve(out.path), pngBuffer);

		return out;
	} catch (err) {
		console.error(err);
		console.debug(JSON.stringify(options, null, 5));
		throw new Error("[social-card] Failed to generate social-card");
	}
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

// Credit: https://github.com/Princesseuh/astro-social-images
export function getHash(options: Options) {
	const hash = createHash("sha256");
	hash.update(JSON.stringify(options));
	return hash.digest("base64url");
}

export function hashProps(...props: any[]) {
	const hash = createHash("sha256");
	for (let prop of props) {
		hash.update(JSON.stringify(prop));
	}
	return hash.digest("base64url");
}

export function escapeHTML(str: string) {
	const table: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"'": "&#39;",
		'"': "&quot;",
	};
	return str.replace(/[&<>'"]/g, (tag) => table[tag]);
}
