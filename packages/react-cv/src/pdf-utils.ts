import { Font } from "@react-pdf/renderer";
import path from "path";

export function registerFonts() {
  Font.registerHyphenationCallback((word) => [word]);
  Font.register({
    family: "DefaultFont",
    fonts: [
      {
        src: path.join(__dirname, "../static/fonts/Montserrat-Regular.ttf"),
      },
      {
        src: path.join(__dirname, "../static/fonts/Montserrat-SemiBold.ttf"),
        fontWeight: 700,
      },
      {
        src: path.join(__dirname, "../static/fonts/Montserrat-Light.ttf"),
        fontWeight: 300,
      },
      {
        src: path.join(__dirname, "../static/fonts/Montserrat-Italic.ttf"),
        fontStyle: "italic",
      },
    ],
  });

  Font.register({
    family: "Brands",
    fonts: [
      {
        src: path.join(__dirname, "../static/fonts/brands.ttf"),
      },
    ],
  });
  Font.register({
    family: "Awesome",
    fonts: [
      {
        src: path.join(__dirname, "../static/fonts/awesome-solid.ttf"),
      },
    ],
  });
}
