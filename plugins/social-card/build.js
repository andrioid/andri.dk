"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.generateCard = generateCard;

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _overlay = _interopRequireDefault(require("./overlay"));

var _card = _interopRequireDefault(require("./card"));

var _split = _interopRequireDefault(require("./designs/split"));

const sharp = require('sharp');

const fs = require('fs');

const path = require('path');

const buffer = require('buffer');

// Default background from: https://pixabay.com/photos/lake-water-wave-mirroring-texture-2063957/
// Only used if nothing specified by options, or node.frontmatter.cover
const defaultBackgroundImage = path.join(__dirname, './src/default-background.jpg');

async function generateCard({
  title = '',
  subtitle = '',
  backgroundImage = defaultBackgroundImage,
  authorImage64,
  design = 'default' // default, card, split

}, oname) {
  if (!fs.existsSync(backgroundImage)) {
    backgroundImage = defaultBackgroundImage;
  }

  let OverlayComponent;

  switch (design) {
    case 'card':
      OverlayComponent = _card.default;
      break;

    default:
      // temp
      OverlayComponent = _overlay.default;
    // OverlayComponent = Split
  }

  const svgbuffer = Buffer.from(_server.default.renderToStaticMarkup(_react.default.createElement(OverlayComponent, {
    title: title,
    subtitle: subtitle,
    authorImage64: authorImage64
  })));
  const infile = new fs.ReadStream(backgroundImage);
  const ostream = fs.WriteStream(oname);
  const overlayer = sharp().resize({
    width: 1200,
    height: 600
  }).composite([{
    input: svgbuffer,
    blend: 'over'
  }]).jpeg();
  return infile.pipe(overlayer).pipe(ostream);
}