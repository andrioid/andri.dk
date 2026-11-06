import { CollectionEntry } from "astro:content";
import { createElement } from "react";
import type { Renderer } from "takumi-js/node";
import ImageResponse from "takumi-js/response";
import { OgPostCard } from "./og";
import { takumiImages } from "./takumi";

export async function ogCardResponse({
	post,
	renderer,
}: {
	post: CollectionEntry<"blog">;
	renderer: Renderer;
}) {
	return new ImageResponse(
		createElement(OgPostCard, {
			post: post,
		}),
		{
			width: 1200,
			height: 630,
			format: "webp",
			headers: {
				"Cache-Control": "public, max-age=3600",
			},
			drawDebugBorder: false,
			renderer,
			images: takumiImages,
		},
	);
}
