# gatsby-plugin-social-card

**Note: Work in progress. It might blow up**## Features

### Backgrounds

You can put a cover frontmatter on your post, and we'll use that. Otherwise, we'll use a default-background that you can specify or if that fails, we'll use a fallback one.

![default card design](img/default-design.jpg)

### Designs

There are two design available now, "card" and "default". But we can expand that later.

![default card design](img/card-design.jpg)

### Author image

If specified, an author image is shown on the image. That is also configurable.

![default card design](img/cover-custom-author.jpg)

### Custom author-image

The author image can be ommitted if it's not wanted, or customized in the configuration.

## Install

```sh
yarn add @andrioid/gatsby-plugin-social-cards
# or npm install --save @andrioid/gatsby-plugin-social-cards
```

## How to use

First configure our site to use the plugin. You don't need to specify options.

_gatsby-config.js_

```js
plugins: [
	{
		resolve: '@andrioid/gatsby-plugin-social-cards',
		options: {
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

Then you need to add the meta tags to your site. An example of that:

```jsx
// Borrowed and adapted from Kent C. Dodds - Thank Kent!
// https://github.com/kentcdodds/kentcdodds.com/blob/master/src/components/seo/index.js

import Helmet from 'react-helmet'

export const SEO = ({ postData, frontmatter = {}, metaImage, isBlogPost }) => (
	<Helmet>
		{/* General tags */}
		<title>{title}</title>
		<meta name="description" content={description} />
		<meta name="image" content={image} />

		{/* OpenGraph tags */}
		<meta property="og:url" content={url} />
		{isBlogPost ? <meta property="og:type" content="article" /> : null}
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:image" content={image} />

		{/* Twitter Card tags */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:creator" content={seo.social.twitter} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={image} />
	</Helmet>
)
```

I'm not going to tell you how to best set your meta-tags. You might have a layout file that does it, you might do something like the above. The choice is yours.

All you need to know is that your node has a `socialcard` field on it that tells you where the image is.

## Pitfalls

### Fonts

We use sharp to convert our SVG images to JPG. The means that the fonts available to you are limited to those of the build-machine.
