import { ResvgRenderOptions } from "@resvg/resvg-js";

export interface Options {
	svg: string;
	resvg?: ResvgRenderOptions;
}

export interface Result {
	url: string;
	path: string;
	hash: string;
}
