const sizes = {
  height: {
    "half-screen": "50vh",
    "one-third-screen": "33vh",
    "full-height": "100vh",
  },
  width: {
    none: "0px",
    "half-screen": "50vw",
    "one-third-screen": "33vw",
    "full-width": "100vw",
  },
};

// primary color: #2B6CB0

module.exports = {
  purge: ["./**/*.jsx", "./**/*.ts", "./**/*.tsx", "./**/*.html", "./**/*.js"],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
      height: {
        300: "300px",
        350: "350px",
      },
      width: sizes.width,
      height: sizes.height,
      minWidth: sizes.width,
      maxWidth: sizes.width,
      minHeight: sizes.height,
      maxHeight: sizes.height,
      fontFamily: {
        sans: ["montserrat", "helvetica", "arial"],
        headline: ["montserrat", "helvetica", "arial"],
        mono: ["source code pro"],
      },
    },
  },
  variants: {
    boxShadow: ["responsive", "hover", "focus"],
  },
  plugins: [
    function ({ addBase, config }) {
      addBase({
        // Add base styles when needed
      });
    },
  ],
};
