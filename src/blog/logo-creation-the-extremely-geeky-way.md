---
path: "/blog/logo-creation-the-extremely-geeky-way"
date: "2011-08-10T17:32:31.000Z"
title: "Logo creation, the (extremely) geeky way!"
tags: ["Studies", "Projects"]
---

Recently, me and my excellent group have been working on our semester report and we're currently down to the tiny details and hopefully we'll soon be ready to print. What has annoyed me for a while is the quality of the logo that the university hands out to its students. The only logo that has any actual colors is a JPG version that doesn't scale (or print) very well. There is also a Postscript version, but that only has one color. I've been creating various graphics with PGF/TikZ ([other examples](http://www.texample.net/tikz/examples/)) and LaTeX during the semester so why not use this to create the logo as well? ![](/sites/andrioid.net/files/aaueps.png)![](http://www.lfd.learning.aau.dk/Skabelon/aau_logo_en.gif)

### Plan

*   Extract the actual logo (coordinates of the path) from scalable logo
*   Use the coordinates to draw it in TikZ
*   Use the original colors from the JPG version
*   Use LaTeX to render the text under the logo
*   Brag about it on the Internet

### Result

![](/sites/andrioid.net/files/tikzaaulogo.png "AAU logo")

### Howto

1.  Convert the EPS to a SVG to determine the coordinates (easier than to draw it by hand)  
    [How to convert EPS to SVG](http://chrisdown.wordpress.com/2007/12/29/eps-to-svg-conversion/). I was lucky enough to find the SVG online.
2.  Fetch the [Inkscape to TikZ exporter](http://code.google.com/p/inkscape2tikz/) and export the path to a LaTeX file
3.  Tweak the TikZ code until you're satisfied with the results and run pdflatex on it.

### Source

*   [LaTeX source code](/sites/andrioid.net/files/logo.tex)
*   [PDF output, ready to print](/sites/andrioid.net/files/logo.pdf)

### Disclaimer

The artwork is not of my design. It belongs the University of Aalborg and is a registered trademark. Their official logo is available [here](http://adm.aau.dk/ansatte/logo/index.htm). I just hope this little experiment of mine is ok with the AAU lawyers. **Fellow students:**I would appreciate a link back to this story if you decide to use this version of the logo. The LaTeX source is hereby licensed to the public domain.