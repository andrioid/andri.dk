"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

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
    id: "shadow"
  }, _react.default.createElement("feDropShadow", {
    dx: "0.2",
    dy: "1.2",
    stdDeviation: "0.2",
    floodOpacity: "0.5"
  }))), _react.default.createElement("g", {
    filter: "#shadow"
  }, _react.default.createElement("rect", {
    width: "400",
    height: "60",
    x: "0",
    y: "140",
    opacity: "0.6",
    style: {
      fill: backgroundColor
    }
  })), authorImage64 ? _react.default.createElement("g", {
    filter: "#shadow"
  }, _react.default.createElement("g", {
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
  }))) : null, _react.default.createElement("g", {
    style: {
      fill: '#fff',
      fontSize: 14
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