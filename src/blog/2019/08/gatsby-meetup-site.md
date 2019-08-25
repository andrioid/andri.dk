---
path: '/blog/2019/08/gatsby-meetup-site'
date: '2019-08-25T00:00:00.000Z'
title: 'Making a Gatsby site from Meetup event data'
tags: ['react', 'gatsby', 'meetup']
draft: false
---

As part of my talk preperation for Aalborg Frontend Meetup, I was going to do a walkthrough of a new Gatsby site and use [gatsby-source-meetup](https://www.gatsbyjs.org/packages/gatsby-source-meetup/?=meetup) to import the upcoming events.

Imagine my surprise, when I discovered that Meetup had stopped issuing API keys.

## gatsby-source-ical

Gatsby has a wonderful collection of source plugins, and one of them happens to be [gatsby-source-ical](https://www.gatsbyjs.org/packages/gatsby-source-ical/?=ical). I'll hand it to Meetup support; they did send me a useful link that indicated they I may not need an API, since they have a calendar feed available.

## Finding the calendar export

First, find your group on [Meetup](https://www.meetup.com), click "Events", "Calendar" and at the bottom there are feed links (if you're logged in).

For our group, the URL is: "https://www.meetup.com/Aalborg-Frontend/events/ical/"

## Add the plugin

```sh
yarn add gatsby-source-ical
```

### gatsby-config.js

```js
// In your gatsby-config.js
module.exports = {
	plugins: [
		// You can have multiple instances of this plugin
		// to read source nodes from different remote files
		{
			resolve: `gatsby-source-ical`,
			options: {
				name: `events`,
				url: `https://web-standards.ru/calendar.ics`
			}
		}
	]
}
```

### Query the data

```
{
	allIcal {
		edges {
			node {
				start
				end
				summary
			}
		}
	}
}
```

## Why?

I put this together in case someone else is creating a meetup website with Gatsby and got frustrated with the API change.
