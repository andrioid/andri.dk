import { CollectionEntry } from "astro:content";
import { createElement } from "react";
import type { Renderer } from "takumi-js/node";
import ImageResponse from "takumi-js/response";
import { OgPostCard } from "./og";
import { OG_IMAGE_SIZE, takumiImages } from "./takumi";

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
			...OG_IMAGE_SIZE,
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
