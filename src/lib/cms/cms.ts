import { createDirectus, readItems, rest, staticToken } from "@directus/sdk";
import type { CollectionEntry } from "astro:content";
import type { DirectusBlog } from "./blog";

type Schema = {
	blog: Array<DirectusBlog>;
};

export function getDirectusClient() {
	const URL = import.meta.env.DIRECTUS_URL || process.env.DIRECTUS_URL;
	const TOKEN = import.meta.env.DIRECTUS_TOKEN || process.env.DIRECTUS_TOKEN;

	if (!URL || !TOKEN) {
		console.log("URL/TOKEN", URL, TOKEN);
		// Will fail at build time: https://fly.io/docs/reference/build-secrets/
		throw new Error("Missing CMS URL and/or TOKEN.");
	}
	const directus = createDirectus<Schema>(URL)
		.with(rest())
		.with(staticToken(TOKEN));
	return directus;
}

export function getAssetURL(id: string) {
	return `${URL}/assets/${id}`;
}
