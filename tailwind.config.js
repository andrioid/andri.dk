const defaultTheme = require("tailwindcss/defaultTheme")

const sizes = {
  height: {
    "half-screen": "50vh",
    "one-third-screen": "33vh",
  },
  width: {
    none: "0px",
    "half-screen": "50vw",
    "one-third-screen": "33vw",
  },
};

// primary color: #2B6CB0

module.exports = {
  content: [
    "./src/**/*.jsx",
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.astro",
  ],
  theme: {
    extend: {
      height: {
        300: "300px",
        350: "350px",
      },
      minWidth: sizes.width,
      maxWidth: sizes.width,
      minHeight: sizes.height,
      maxHeight: sizes.height,
      fontFamily: {
        sans: ["Montserrat Variable", ...defaultTheme.fontFamily.sans],
        headline: ["Montserrat Variable", defaultTheme.fontFamily.headline],
        mono: ["source code pro"],
      },
    },
  },
  variants: {
    boxShadow: ["responsive", "hover", "focus"],
  },
  plugins: [require("@tailwindcss/typography")], // markdown auto typography
};
