// Purpose: Entry-point for building all of the PDF files
require("source-map-support").install();

import React from "react";
import ReactDOMServer from "react-dom/server";
import ReactPDF, { Font, PDFViewer, renderToString } from "@react-pdf/renderer";
import { CVDocument } from "./documents/cv";
import { registerFonts } from "./pdf-utils";
import globby from "globby"; // Note: v12 of Globby uses ESM and breaks a bunch of stuff
import path from "path";
import { ApplicationDoc } from "./documents/application";
import { ensureFile, readFile, readFileSync, writeFileSync } from "fs-extra";
import matter from "gray-matter";

type Target = "pdf" | "web";
const targets: ReadonlyArray<Target> = ["pdf", "web"];

declare global {
  var target: Target;
}

async function renderToPDF() {
  // Disables hyphenation because it was breaking up words in a weird way
  registerFonts(); // sync

  try {
    const letters = await globby("./letters/**/*.md");
    for (const k in letters) {
      const p = path.parse(letters[k]);
      const fn = path.join("pdf", `${p.dir}/${p.name}.pdf`);
      await ensureFile(fn);

      const mdStr = readFileSync(letters[k]).toString();
      const md = matter(mdStr);
      await ReactPDF.renderToFile(
        <ApplicationDoc frontmatter={md.data} markdown={md.content} />,
        fn
      );
    }

    await ReactPDF.renderToFile(<CVDocument />, "pdf/cv.pdf");
  } catch (err) {
    console.error(err);
  }
}

async function parseArgs() {
  const args = process.argv.slice(2);
  const [target] = args;
  global.target = target as Target;
}

async function main() {
  await parseArgs();
  if (!global.target) {
    console.error("Usage: build web|pdf");
    process.exit(1);
  }
  await renderToPDF();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
