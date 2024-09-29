import { Font, renderToBuffer } from "@react-pdf/renderer";

import path from "node:path";
import fs from "node:fs";
import { DEFAULT_FONT, Resume } from "./";
import { colors } from "./colors";
import { createElement } from "react";
import { CVWrapper } from "./react/cv-wrapper";

import montserratRegular from "@static/fonts/pdf/Montserrat-Regular.ttf?url";
import monsterratLight from "@static/fonts/pdf/Montserrat-Light.ttf?url";
import monsterratItalitc from "@static/fonts/pdf/Montserrat-Italic.ttf?url";
import monsterratSemiBold from "@static/fonts/pdf/Montserrat-SemiBold.ttf?url";
import brands from "@static/fonts/pdf/brands.ttf?url";
import awesome from "@static/fonts/pdf/awesome.ttf?url";

function fixFontImport(imp: string): string {
  const out = path.join(process.cwd(), imp);
  if (!fs.existsSync(out)) {
    throw new Error("Font not found: " + out);
  }
  console.log("Fix font", out);
  return out;
}

export function registerFonts() {
  Font.registerHyphenationCallback((word) => [word]);
  console.log("Montserrat", fixFontImport(montserratRegular));
  try {
    Font.register({
      family: DEFAULT_FONT,
      fonts: [
        {
          src: fixFontImport(montserratRegular),
        },
        {
          src: fixFontImport(monsterratSemiBold),
          fontWeight: 700,
        },
        {
          src: fixFontImport(monsterratLight),
          fontWeight: 300,
        },
        {
          src: fixFontImport(monsterratItalitc),
          fontStyle: "italic",
        },
      ],
    });

    Font.register({
      family: "Brands",
      src: fixFontImport(brands),
    });
    Font.register({
      family: "Awesome",
      src: fixFontImport(awesome),
    });
  } catch (err) {
    console.error("WTF");
  }
}

export async function resumeToString(resume: Resume) {
  registerFonts();
  const cvDoc = createElement(CVWrapper, { resume: resume });
  return renderToBuffer(cvDoc as any);
}

async function stream2buffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
}

export function getColor(name: keyof typeof colors | string): string {
  return colors[name as keyof typeof colors];
}
