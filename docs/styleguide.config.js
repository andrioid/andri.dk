const path = require("path");

const docs = path.resolve(__dirname);
const root = docs.replace("/docs", "");

const customWebpack = require("./webpack");

module.exports = {
  sections: [
    {
      name: "Components",
      components: [`${root}/components/*.js`, `${root}/components/**/*.tsx`],
    },
  ],
  require: [path.join(__dirname, "../global.css")],
  propsParser: require("react-docgen-typescript").withDefaultConfig().parse,
  // configureServer(app) {
  //   app.get("/static/*", (req, res) => {
  //     const file = req.originalUrl.split("?")[0];
  //     res.status(200).sendFile(`${root}${file}`);
  //   });
  // },
  ...customWebpack,
};
