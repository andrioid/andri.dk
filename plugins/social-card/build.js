"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.generateCard = generateCard;

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _overlay = require("./overlay");

const sharp = require('sharp');

const fs = require('fs');

const path = require('path');

const buffer = require('buffer');

async function generateCard({
  title = '',
  subtitle = ''
}, oname) {
  const iname = path.join(__dirname, './src/header.svg');
  const pname = path.join(__dirname, './src/plain.svg');
  const svgbuffer = Buffer.from(_server.default.renderToStaticMarkup(_react.default.createElement(_overlay.Overlay, {
    title: title,
    subtitle: subtitle
  })));
  const infile = new fs.ReadStream(iname);
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