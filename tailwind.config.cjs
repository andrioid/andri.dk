const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

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
    "./src/**/*.mdx",
    "./src/**/*.js",
    "./src/**/*.astro",
  ],
  theme: {
    extend: {
      colors: {
        andri: "#59B4FF",
        hover: colors.pink["500"],
      },
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
        mono: ["Source Code Pro variable", defaultTheme.fontFamily.mono],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  variants: {
    boxShadow: ["responsive", "hover", "focus"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    ({ addVariant }) => addVariant("target", "&:target"),
  ], // markdown auto typography
};
