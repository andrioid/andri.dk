import { Resvg } from "@resvg/resvg-js";
import { Options, Result } from "./types";

export async function generateImage(options: Options): Promise<Result> {
	const resvg = new Resvg(options.svg, options.resvg);
	return {
		url: "moo",
		path: "moo",
		hash: "omo",
	};
}
