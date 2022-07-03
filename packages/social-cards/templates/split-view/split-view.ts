//@ts-ignore svgdom doesn't have types, but we only use this one function
import { escapeHTML, hashProps } from "../../build";
import { GenerateOptions } from "../../types";

export function SplitView(
	props: Readonly<{
		title: string;
		tags?: string[];
		description?: string;
		coverImage?: string;
		authorImage: string;
	}>
): GenerateOptions {
	const iwidth = 640;
	const iheight = 360; // To match Twitter's weird 1.91:1 ratio
	const texty = 60;
	const leftBoxX = iwidth / 4;
	const xMargin = leftBoxX + 28;

	const leftImageWidth = 100;
	const leftImage = `
	<g stroke="2" clip-path="url(#roundImageClip)">

		<image
			width="${leftImageWidth}"
			height="${leftImageWidth}"
			x="${(leftBoxX - leftImageWidth) / 2}"
			y="60"
			style="translate(100)"
			xlink:href="${props.authorImage}"
		/>	
	</g>
	`;

	let svg = "";
	svg += `
	<svg
		width="1280"
		height="720"
		viewBox="0 0 ${iwidth} ${iheight}"
		font-size="12"
		font-family="Montserrat"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<defs>
			<clipPath id="roundImageClip">
				<use xlink:href="#roundImageShape" />
			</clipPath>

			<rect
				id="roundImageShape"
				width="100"
				height="100"
				fill="none"
				x="${(leftBoxX - leftImageWidth) / 2}"
				y="60"
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
			<filter id="spotlight">
				<feSpecularLighting result="spotlight" specularConstant="1" surfaceScale="5" 
					specularExponent="7" lighting-color="white" diffuseConstant="1" kernelUnitLength="2">
					<feSpotLight x="${leftBoxX / 2}" y="${iheight + 50}" z="0"
	 limitingConeAngle="15" pointsAtX="${
			leftBoxX / 2
		}" pointsAtY="${0}" pointsAtZ="0" />
				</feSpecularLighting>
				<feComposite in="SourceGraphic" in2="spotlight" operator="out"
					k1="0" k2="1" k3="1" k4="0"/>
			</filter>
		</defs>
		<rect x="0" y="0" width="${leftBoxX}" height="${iheight}" style="fill: #000; filter:url(#spotlight)" />

		<g class="texts" font-size="1.9em">
			
			<text x="${
				leftBoxX + 140
			}" y="${texty}" font-weight="bold" transform="translate(100)">
				<tspan text-anchor="middle">${escapeHTML(props.title)}</tspan>
			</text>
			
		</g>
		${leftImage}
	</svg>		
	`;
	return {
		svg: svg,
		hash: hashProps(props),
	} as GenerateOptions;
}
