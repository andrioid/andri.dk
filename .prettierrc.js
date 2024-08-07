const path = require("path");

module.exports = {
  overrides: [
    {
      files: "**/*.astro",
      options: {
        parser: "astro",
        remo,
      },
    },
  ],
  // This helps the vscode plugin find the correct plugin
  plugins: ["prettier-plugin-astro"],
};
