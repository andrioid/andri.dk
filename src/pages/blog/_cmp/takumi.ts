import { PersistentImage, Renderer } from "@takumi-rs/core";
import { readFileSync } from "node:fs";
import path from "node:path";

const takumiImages: Array<PersistentImage> = [
  {
    src: "avatar",
    data: readFileSync(path.join(process.cwd(), "public/img/coffee-art.jpg")),
  },
];

export const takumiRenderer = new Renderer({
  persistentImages: takumiImages,
});
