---
path: "/blog/2d-game-map-in-canvas"
date: "2011-08-10T17:43:00.000Z"
title: "2D Game Map in Canvas"
tags: ["Projects"]
---

**This project is discontinued. The latest version went down with the two hard disks that failed :(** For the last couple of weeks I've been playing around with HTML5 or more specifically, the canvas element. Coupled with jQuery and some basic Javascript I've created a 2 dimensional game map for a strategy board game (like [Travian](http://www.travian.com)). Should work in most 2D browser game worlds as long as the coordinates are two dimensional. [![](/sites/andrioid.net/files/maptest1t.png "Overview")](/sites/andrioid.net/files/maptest1.png)[![](/sites/andrioid.net/files/maptest2t.png "Closer look")](/sites/andrioid.net/files/maptest2.png)

### Features

*   Map controls Overlay: North, South, East, West. Zoom In, Zoom Out.
*   Mouse controls: Zoom with scroll wheel. Drag map to move.
*   JSON backend: Dynamically fetches the tiles requested through AJAX.
*   Works with Travian: Currently the prototype is running on a dataset from a Danish Travian server.
*   Village information: A mouse-over effect showing details about the current village.
*   Village details: Possible to click a village for even more information through JSON.
*   Dynamic size: Will function in a small element or full screen.
*   Ease of deployment: Implemented as a jQuery plugin.