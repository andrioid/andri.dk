import { Font } from "@react-pdf/renderer";

import montserratRegular from '../static/fonts/Montserrat-Regular.ttf'

export function registerFonts() {
  Font.registerHyphenationCallback((word) => [word]);
  Font.register({
    family: "DefaultFont",
    fonts: [
      {
        src: "static/fonts/Montserrat-Regular.ttf",
      },
      {
        src: "static/fonts/Montserrat-SemiBold.ttf",
        fontWeight: 700,
      },
      {
        src: "static/fonts/Montserrat-Light.ttf",
        fontWeight: 300,
      },
      {
        src: "static/fonts/Montserrat-Italic.ttf",
        fontStyle: "italic",
      },
    ],
  });

  Font.register({
    family: "Brands",
    fonts: [
      {
        src: "static/fonts/brands.ttf",
      },
    ],
  });
  Font.register({
    family: "Awesome",
    fonts: [
      {
        src: "static/fonts/awesome-solid.ttf",
      },
    ],
  });
}
