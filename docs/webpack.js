const path = require("path");

const docs = path.resolve(__dirname);
const root = docs.replace("/docs", "");
const aliases = require(`${root}/aliases`); // eslint-disable-line import/no-dynamic-require

const outputConfig = {
  path: `${docs}/styleguide`,
  filename: "build/bundle.js",
  chunkFilename: "build/[name].js",
};
const rulesConfig = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            "@babel/preset-react",
            ["next/babel", { "preset-env": { modules: "commonjs" } }],
          ],
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["tailwindcss", "autoprefixer"],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: aliases,
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = {
  webpackConfig: rulesConfig,
  dangerouslyUpdateWebpackConfig: (config) => {
    config.output = outputConfig;
    return config;
  },
};
