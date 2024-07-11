import fs from "node:fs";
import type { ReactNode } from "react";
import satori from "satori";
import { html } from "satori-html";
import type { CommonBlog } from "../cms";

export async function postCard(post: CommonBlog) {
	let bgImage = post.coverImage ?? "";
	// bgImage =
	// 	"https://directus.andri.dk/assets/803c2127-b04e-490d-89d1-6e52e9271138";
	const out = html`<div
		tw="flex flex-col w-full h-full justify-between"
		style="display: flex; background-image: linear-gradient(180deg, #0e2643, #2460A7)"
	>
		<div>test</div>
		<div
			tw="mx-4 rounded-t-md shadow-lg rounded-x-md bg-white h-30 bottom-0 flex justify-center text-2xl font-bold text-black py-4"
		>
			${post.title}
		</div>
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
