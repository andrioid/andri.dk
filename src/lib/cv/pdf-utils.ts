import { Font, renderToBuffer } from "@react-pdf/renderer";

import path from "node:path";
import fs from "node:fs";
import { DEFAULT_FONT, Resume } from "./";
import { colors } from "./colors";
import { createElement } from "react";
import { CVWrapper } from "./react/cv-wrapper";

// PDF can only be generated server-side (import doesnt work well with this)
export const STATIC_DIR = path.join(process.cwd(), "static");

function fixFontImport(imp: string): string {
  const out = path.join(STATIC_DIR, "fonts/pdf", imp);
  if (!fs.existsSync(out)) {
    throw new Error("Font not found: " + out);
  }
  return out;
}

export function registerFonts() {
  Font.registerHyphenationCallback((word) => [word]);

  try {
    Font.register({
      family: DEFAULT_FONT,
      fonts: [
        {
          src: fixFontImport("Montserrat-Regular.ttf"),
        },
        {
          src: fixFontImport("Montserrat-SemiBold.ttf"),
          fontWeight: 700,
        },
        {
          src: fixFontImport("Montserrat-Light.ttf"),
          fontWeight: 300,
        },
        {
          src: fixFontImport("Montserrat-Italic.ttf"),
          fontStyle: "italic",
        },
      ],
    });

    Font.register({
      family: "Brands",
      src: fixFontImport("brands.ttf"),
    });
    Font.register({
      family: "Awesome",
      src: fixFontImport("awesome-solid.ttf"),
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

export function getColor(name: keyof typeof colors | string): string {
  return colors[name as keyof typeof colors];
}
