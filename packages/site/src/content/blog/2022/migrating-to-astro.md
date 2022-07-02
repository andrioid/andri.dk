---
slug: "2022/migrating-to-astro"
date: "2022-07-02T00:00:00.000Z"
title: "Migrating to Astro"
description: "How I built my new site with Astro"
tags: ["blog", "frontend"]
---

This site was originally built with [Gatsby](https://www.gatsbyjs.com) site in 2019 and I used to teach myself Gatsby, React, GraphQL and Tailwind. Gatsby was a natural fit, because I was excited about both GraphQL and React at the time.

I've been considering migrating the site to either Next.js or Remix, but after playing around for a while I settled on [Astro](www.astro.build).

## What the hell is Astro?

Astro is a static site generator (and SSR) that isn't stuck to a single framework. It supports most of them out of the box. The spoke to me, because I have a bunch of older React components that I wanted to reuse.

## What's in the box?

### TypeScript

Since I first created the site, I've learned TypeScript, so everything is now strictly typed.

### Resumé

The page parses a [JSON resume](https://jsonresume.org) a creates the technology summary on the homepage, but also [my cv](/cv.pdf). The enables the lazy dev that I am to update both my CV and homepage in one go.

The CV is rendered as an Astro page, as part of the build process, instead of as a post-build hook on the old site.

### Social Cards

A site in 2022 isn't complete without being able to see a pretty preview when sharing on the larger networks.

![social-card-example](social-card-example.png)

When I created [gatsby-plugin-social-cards](https://github.com/andrioid/gatsby-plugin-social-cards), I used React to generate dynamic SVG files that [sharp](https://sharp.pixelplumbing.com) converted into png files. Sharp uses "fontconfig", so the fonts available when converting the SVG file are dependant on the machine. That made me lose interest in developing my social card plugin further.

Fast forward to 2022. I learned from a colleague that there is a Rust library called [resvg](https://github.com/RazrFalcon/resvg) that can convert to PNG and **supports custom fonts**! It even has a [nice wrapper](https://github.com/yisibl/resvg-js) for JavaScript that I was able to use.

Astro already has a very nice social-card plugin called [astro-social-images](https://github.com/Princesseuh/astro-social-images#readme) and much of the plumbing between my custom hack and Astro is based off of that. Right now, this works for my purposes, but I might open-source it later.

### Storing the content

Here my story takes a sad turn. Clones of my site were popping up with the content in place, so I moved everything off Git and into Nextcloud. But dealing with images across different systems has become a real pain, so I've moved the content back into Git.

But until I come up with a better solution for keeping the content seperate from the source-code, my repository is now private. If you want to take a look, reach out and I will invite you until I find a better solution.

### Other

- React: Mostly for the resumé and a few minor components
- Tailwind for styling

### Final words

I already had a working Next.js branch, but a little Saturday project to see how troublesome it would be to move some of it to Astro turned into a full migration project.

My old React components worked out of the box, but most of the newer components are built as Astro components. The syntax is pretty clean and reminds me of Svelte. What finally sold me, was being able to render the resumé PDF directly from Astro.

Was this overengineering? Absolutely! But it was very fun.
