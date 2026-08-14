// The site-level social card, served at /og.webp and referenced as the home
// page's og:image. Same 1200x630 webp pipeline as the per-post cards.
import ImageResponse from "@takumi-rs/image-response";
import { createElement } from "react";
import { resumeRaw } from "~/lib/cv";
import { takumiRenderer } from "./blog/_cmp/takumi";
import { OgHomeCard } from "./_cmp/og-home";

export async function GET() {
	return new ImageResponse(
		createElement(OgHomeCard, {
			name: resumeRaw.basics.name,
			tagline: resumeRaw.basics.label,
		}),
		{
			width: 1200,
			height: 630,
			format: "webp",
			headers: {
				"Cache-Control": "public, max-age=3600",
			},
			drawDebugBorder: false,
			renderer: takumiRenderer,
		},
	);
}
