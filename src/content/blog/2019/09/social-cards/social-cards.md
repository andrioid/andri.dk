---
date: "2019-09-15T00:00:00.000Z"
draft: false
ogImage: 2019/09/social-cards/social-cards.png
slug: 2019/09/announcing-gatsby-plugin-social-cards
tags:
    - react
    - gatsbyjs
    - open-graph
title: Announcing gatsby-plugin-social-cards
---
Ever seen those images shown next to posts on Twitter, Slack or Facebook? Ever wonder where they come from? Me too!

This plugin will create automatic cards for your (ReMark) at build-time.

## Announcing

I am ready to announce my new Gatsby plugin, gatsby-plugin-social-cards.

There are a few alternatives for Gatsby social-cards, but I wanted to try making these cards with SVG, React and the Sharp library that most Gatsby sites already depend on.

Currently this plugin resides within my site, but if there is interest in it, I'll move it into its own repo. Contact me on Twitter if you have any issues.

## Features

### Backgrounds

You can put a cover frontmatter on your post, and we'll use that. Otherwise, we'll use a default-background that you can specify or if that fails, we'll use a fallback one.

![default card design](default-design.jpg)

### Designs

There are two design available now, "card" and "default". But we can expand that later.

![default card design](card-design.jpg)

### Author image

If specified, an author image is shown on the image. That is also configurable.

![default card design](cover-custom-author.jpg)

### Custom author-image

The author image can be ommitted if it's not wanted, or customized in the configuration.

## Install

```bash
yarn add gatsby-plugin-social-cards
# or npm install --save gatsby-plugin-social-cards
```

## How to use

Please see the [README](https://www.npmjs.com/package/gatsby-plugin-social-cards) for how to use.
