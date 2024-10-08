import type { ResvgRenderOptions } from "@resvg/resvg-js";

export interface GenerateOptions {
  svg: string; // string of svg
  resvg?: ResvgRenderOptions; // optional resvg override
  outputDir: string;
  urlPath: string;
  publicDir: string;
  hash: string;
}

export interface Result {
  url: string;
  path: string;
  hash: string;
  generated: boolean;
}

// Templates need to supply svg and maybe some fonts
export type TemplateResponse = [svg: string, resvg?: ResvgRenderOptions];
