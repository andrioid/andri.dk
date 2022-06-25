import { ResvgRenderOptions } from "@resvg/resvg-js";

export interface Options {
	svg: string;
	resvg?: ResvgRenderOptions;
	outputDir: string;
	urlPath: string;
	publicDir: string;
	hash: string;
}

export interface Result {
	url: string;
	path: string;
	hash: string;
}

// Templates need to supply svg and maybe some fonts
export type TemplateResponse = [svg: string, resvg?: ResvgRenderOptions];
