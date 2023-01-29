import {
	renderToFile,
	renderToString,
	renderToStream,
} from "@react-pdf/renderer";
import React from "react";
import { Stream } from "stream";
import { Resume } from "./components/resume-types";
import { CVWrapper } from "./documents/cv-wrapper";
import { registerFonts } from "./pdf-utils";
export * from "./components/resume-types";
export const ASSET_PATH = "../react-cv/static";
export const DEFAULT_FONT = "Montserrat";

export async function resumeToString(
	resume: Resume,
	assetPath: string = "../react-cv/static"
) {
	registerFonts(assetPath);
	const cvDoc = React.createElement(CVWrapper, { resume: resume });
	const res = await renderToStream(cvDoc as any);
	return stream2buffer(res);
}

async function stream2buffer(stream: Stream): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const _buf = Array<any>();

		stream.on("data", (chunk) => _buf.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(_buf)));
		stream.on("error", (err) => reject(`error converting stream - ${err}`));
	});
}
