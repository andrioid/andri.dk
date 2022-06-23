import { Options } from "../types";

export function Card({
	title = "default title",
	subtitle = "default subtitle",
	authorImageBase64,
}: {
	title: string;
	subtitle?: string;
	authorImageBase64?: string;
}): [string, Options] {
	const iwidth = 400;
	const iheight = 200;
	const xMargin = 40;
	const authorWidth = 32;

	let texty = 170;
	if (!subtitle) {
		texty = texty + 5;
	}
	const imageGroup = authorImageBase64
		? `
	<g stroke="2" clipPath="url(#clip)">
	<rect
	  id="rect"
	  width=${authorWidth}
	  height=${authorWidth}
	  x=${iwidth - authorWidth - xMargin}
	  y="156"
	  fill="none"
	  stroke="#2b6cb0"
	  strokeWidth="1"
	  rx="50"
	/>
	<image
	  width=${authorWidth}
	  height=${authorWidth}
	  x=${iwidth - authorWidth - xMargin}
	  y="156"
	  xlinkHref=${authorImageBase64}
	/>
	</g>`
		: "";

	let svg = "";
	svg += `
	<svg
		width="1200"
		height="600"
		viewBox="0 0 ${iwidth} ${iheight}"
		font-family="Inter"
		font-size="12"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
	>
		<defs>
			<clipPath id="clip">
			<use xlinkHref="#rect" />
			</clipPath>
			<filter id="shadow" asx="0" asy="0">
			<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
			<feOffset dx="0.5" dy="-0.5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
			</filter>
		</defs>

		<g filter="url(#shadow)">
			<rect
			width="360"
			height="120"
			x="20"
			y="140"
			rx="10"
			style="fill: #fff; strokeWidth: 0;"
			/>
		</g>
		<g class="texts" style="fill: #000; font-size: 12;">
			<text x="${xMargin}" y="${texty}">
				${title}
			</text>
			<text x="${xMargin}" y="${texty + 15}" style="font-size: 10; fill: #a3a3a3;">
				${subtitle}
			</text>
		</g>
	</svg>		
	`;

	return [svg];
}
