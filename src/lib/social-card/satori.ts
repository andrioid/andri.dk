import satori from "satori";
import { html } from "satori-html";
import type { SocialCardProps } from "./social-card";
import type { ReactNode } from "react";
import Montserrat from "../../../public/fonts/Montserrat-Regular.ttf";
import fs from "node:fs";

export async function designExample(card: SocialCardProps) {
	let bgImage = card.image ?? "";
	// bgImage =
	// 	"https://directus.andri.dk/assets/803c2127-b04e-490d-89d1-6e52e9271138";
	const out = html`<div
		tw="flex bg-blue-400 flex-col w-full h-full"
		style="background-image: url(${bgImage}); background-repeat: no-repeat"
	>
		<h1 tw="text-5xl text-center">${card.title}</h1>
	</div>`;

	const svg = await satori(out as ReactNode, {
		width: 600,
		height: 400,
		fonts: [
			{
				name: "Montserrat",
				// Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
				data: fs.readFileSync("./public/fonts/Montserrat-Regular.ttf"),
				weight: 400,
				style: "normal",
			},
			{
				name: "Montserrat",
				// Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
				data: fs.readFileSync("./public/fonts/Montserrat-SemiBold.ttf"),
				weight: 700,
				style: "normal",
			},
			{
				name: "Montserrat",
				// Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
				data: fs.readFileSync("./public/fonts/Montserrat-Italic.ttf"),
				weight: 400,
				style: "italic",
			},
		],
	});
	return svg;
}
