import { PersistentImage, Renderer } from "@takumi-rs/core";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createHighlighter } from "shiki";

const takumiImages: Array<PersistentImage> = [
  {
    src: "avatar",
    data: readFileSync(path.join(process.cwd(), "public/img/coffee-art.jpg")),
  },
];

export const takumiRenderer = new Renderer({
  persistentImages: takumiImages,
});

export const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: [
    "tsx",
    "ts",
    "sql",
    "shell",
    "js",
    "bash",
    "php",
    "html",
    "css",
    "toml",
    "yaml",
    "dockerfile",
  ],
});
