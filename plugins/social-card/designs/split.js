"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _inspector = require("inspector");

const Overlay = ({
  title = '',
  subtitle = '',
  backgroundColor = '#000',
  authorImage64
}) => {
  const truncateAt = 50;

  if (title.length > truncateAt) {
    title = title.substr(0, truncateAt);
    title += '...';
  }

  const iwidth = 400;
  const iheight = 200;
  const xMargin = 20;
  const authorWidth = 150;
  let texty = 20;

  if (!subtitle) {
    texty = texty + 5;
  }

  return _react.default.createElement("svg", {
    width: "1200",
    height: "600",
    viewBox: `0 0 ${iwidth} ${iheight}`,
    fill: "#fff",
    style: {
      fontFamily: 'helvetica'
    }
  }, _react.default.createElement("defs", null, _react.default.createElement("clipPath", {
    id: "clip"
  }, _react.default.createElement("use", {
    xlinkHref: "#rect"
  }))), authorImage64 ? _react.default.createElement("g", {
    stroke: "2",
    clipPath: "url(#clip)"
  }, _react.default.createElement("rect", {
    id: "rect",
    width: "200",
    height: "200",
    x: iwidth - 200,
    y: "0",
    fill: "none",
    stroke: "#2b6cb0",
    strokeWidth: "1" //rx="50"

  }), _react.default.createElement("image", {
    width: 200,
    height: "100%",
    x: iwidth - 200,
    y: "0",
    xlinkHref: authorImage64
  })) : null, _react.default.createElement("g", {
    style: {
      fill: '#000',
      fontSize: 16
    }
  }, _react.default.createElement("switch", null, _react.default.createElement("foreignObject", {
    x: "20",
    y: "20",
    width: "200",
    height: "200"
  }, _react.default.createElement("p", {
    xmlns: "http://www.w3.org/1999/xhtml"
  }, "Text goes here")), _react.default.createElement("text", {
    x: "20",
    y: "20"
  }, "fail")), _react.default.createElement("text", {
    x: xMargin,
    y: texty,
    stroke: "1"
  }, title), _react.default.createElement("text", {
    x: xMargin,
    y: iheight - 20,
    style: {
      fontSize: 10,
      fill: '#a3a3a3'
    }
  }, subtitle)));
};

var _default = Overlay;
exports.default = _default;