import { escapeHTML, hashProps, validateImage } from "../../build";
import type { GenerateOptions } from "../../types";

export function PopupCard(
	props: Readonly<{
		title: string;
		subtitle?: string;
		authorImage?: string;
		backgroundImage?: string;
	}>,
): GenerateOptions {
	// Remember not to pass anything that will change between builds to hashProps
	const hash = hashProps("popup-card", props);
	const iwidth = 400;
	const iheight = iwidth / 1.91; // To match Twitter's weird 1.91:1 ratio

	const xMargin = 30;
	const authorWidth = 32;

	let texty = 162;
	if (!props.subtitle) {
		texty = texty + 5;
	}
	let authorImageSvg = "";
	if (props.authorImage) {
		const authorImage = validateImage(props.authorImage);
		authorImageSvg = `
	<g stroke="2" clip-path="url(#clip)">
		<image
			width="${authorWidth}"
			height="${authorWidth}"
			x="${iwidth - authorWidth - xMargin}"
			y="156"
			xlink:href="${authorImage}"
		/>
	</g>`;
	}

	let backgroundImageSvg = "";
	if (props.backgroundImage) {
		const backgroundImage = validateImage(props.backgroundImage);
		backgroundImageSvg = `
			<image
				width="${iwidth}"
				height="${iheight}"
				x="0"
				y="0"
				xlink:href="${backgroundImage}"
				preserveAspectRatio="xMidYMid slice"
				transform="scale(1.1,1.1)"
			/>
		
		`;
	}

	let tags = "";

	let svg = "";
	svg += `
	<svg
		width="1200"
		height="630"
		viewBox="0 0 ${iwidth} ${iheight}"
		font-size="12"
		font-family="Montserrat"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<defs>
			<clipPath id="clip">
				<use xlink:href="#authorImageRect" />
			</clipPath>
			<rect
				id="authorImageRect"
				width="${authorWidth}"
				height="${authorWidth}"
				x="${iwidth - authorWidth - xMargin}"
				y="156"
				fill="none"
				rx="50"
			/>
	  
			<filter id="shadow" asx="0" asy="0">
				<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
				<feOffset dx="0.5" dy="-0.5" />
				<feMerge>
					<feMergeNode />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		${backgroundImageSvg}

		<g filter="url(#shadow)">
			<rect
				width="360"
				height="120"
				x="20"
				y="140"
				rx="10"
				style="fill: #fff; stroke-width: 0;"
			/>
		</g>

		${authorImageSvg}

		<g class="texts" font-size="1.2em">
			<text x="${xMargin}" y="${texty}" font-weight="bold">
				${escapeHTML(props.title)}
			</text>
			<text x="${xMargin}" y="${texty + 11}" style="font-size: 0.5em;">
				${(props.subtitle && escapeHTML(props.subtitle)) || ""}
			</text>
			${tags}
		</g>
	</svg>		
	`;

	return {
		svg,
		hash,
	} as GenerateOptions;
}
