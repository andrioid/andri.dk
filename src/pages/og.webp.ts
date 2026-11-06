// The site-level social card, served at /og.webp and referenced as the home
// page's og:image. Same webp pipeline and size as the per-post cards.
import { createElement } from "react";
import ImageResponse from "takumi-js/response";
import { resumeRaw } from "~/lib/cv";
import {
	OG_IMAGE_SIZE,
	takumiImages,
	takumiRenderer,
} from "./blog/_cmp/takumi";
import { OgHomeCard } from "./_cmp/og-home";

export async function GET() {
	return new ImageResponse(
		createElement(OgHomeCard, {
			name: resumeRaw.basics.name,
			tagline: resumeRaw.basics.label,
		}),
		{
			...OG_IMAGE_SIZE,
			format: "webp",
			headers: {
				"Cache-Control": "public, max-age=3600",
			},
			drawDebugBorder: false,
			renderer: takumiRenderer,
			images: takumiImages,
		},
	);
}
