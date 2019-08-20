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
  const xMargin = 40;
  const authorWidth = 32;
  let texty = 170;

  if (!subtitle) {
    texty = texty + 5;
  }

  return _react.default.createElement("svg", {
    width: "1200",
    height: "600",
    viewBox: `0 0 ${iwidth} ${iheight}`,
    style: {
      fontFamily: 'helvetica'
    }
  }, _react.default.createElement("defs", null, _react.default.createElement("clipPath", {
    id: "clip"
  }, _react.default.createElement("use", {
    xlinkHref: "#rect"
  })), _react.default.createElement("filter", {
    id: "shadow",
    asx: "0",
    asy: "0",
    swidth: "200%",
    hseight: "200%"
  }, _react.default.createElement("feGaussianBlur", {
    in: "SourceAlpha",
    stdDeviation: "3"
  }), _react.default.createElement("feOffset", {
    dx: "0.5",
    dy: "-0.5"
  }), _react.default.createElement("feMerge", null, _react.default.createElement("feMergeNode", null), _react.default.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), _react.default.createElement("g", {
    filter: "url(#shadow)"
  }, _react.default.createElement("rect", {
    width: "360",
    height: "120",
    x: "20",
    y: "140",
    rx: "10",
    style: {
      fill: '#fff',
      strokeWidth: 0
    }
  })), authorImage64 ? _react.default.createElement("g", {
    stroke: "2",
    clipPath: "url(#clip)"
  }, _react.default.createElement("rect", {
    id: "rect",
    width: authorWidth,
    height: authorWidth,
    x: iwidth - authorWidth - xMargin,
    y: "156",
    fill: "none",
    stroke: "#2b6cb0",
    strokeWidth: "1",
    rx: "50"
  }), _react.default.createElement("image", {
    width: authorWidth,
    height: authorWidth,
    x: iwidth - authorWidth - xMargin,
    y: "156",
    xlinkHref: authorImage64
  })) : null, _react.default.createElement("g", {
    style: {
      fill: '#000',
      fontSize: 12
    }
  }, _react.default.createElement("text", {
    x: xMargin,
    y: texty
  }, title), _react.default.createElement("text", {
    x: xMargin,
    y: texty + 15,
    style: {
      fontSize: 10,
      fill: '#a3a3a3'
    }
  }, subtitle)));
};

var _default = Overlay;
exports.default = _default;