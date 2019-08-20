---
path: '/blog/2019/08/announcing-gatsby-plugin-social-cards'
date: '2019-08-30T00:00:00.000Z'
title: 'Announcing gatsby-plugin-social-cards'
tags: ['react', 'gatsbyjs', 'open-graph']
draft: true
---

I am ready to announce my new Gatsby plugin, gatsby-plugin-social-cards. It automatically generates previews that Twitter, Slack, Facebook and more pick up when pasting links into places.

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

```sh
yarn add @andrioid/gatsby-plugin-social-cards
```

## How to use

_gatsby-config.js_

```js
plugins: [
	{
		resolve: '@andrioid/gatsby-plugin-social-cards',
		options: {
			// All options are optional

			// ommit to skip
			authorImage: './static/img/coffee-art.jpg',
			// image to use when no cover in frontmatter
			backgroundImage: './static/img/hvitserkur.JPG',
			// author to use when no auth in frontmatter
			defaultAuthor: 'Andri Óskarsson',
			// card design
			design: 'default' // 'default' or 'card'
		}
	}
]
```
