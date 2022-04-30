const path = require("path");

module.exports = {
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  // This helps the vscode plugin find the correct plugin
  plugins: [path.resolve(__dirname, "node_modules", "prettier-plugin-astro")],
};
