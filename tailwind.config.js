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
  // not working atm, seems to fuck markdown parsing up
  //   purge: [
  //     "./src/**/*.jsx",
  //     "./src/**/*.ts",
  //     "./src/**/*.tsx",
  //     "./src/**/*.html",
  //     "./src/**/*.js",
  //   ],
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
    function({ addBase, config }) {
      addBase({
        // Add base styles when needed
      });
    },
  ],
};
