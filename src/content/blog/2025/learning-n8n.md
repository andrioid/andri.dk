---
date: "2025-12-31T00:00:00.000Z"
tags:
  - learning
  - automation
title: "Learning n8n and using it to promote my blog"
---

I've been having a bunch of fun learning n8n during the holiday vacation. I've hooked it up so that when I write a blog post in my site, it's published to RSS and...

1. Checks if the URL is already processed, abort if it is
2. Content is summarized by an LLM (I'm lazy, sorry)
3. Stored in a data-table

Then occasionally, it checks if the post has been shared on social-media:

1. If it's shared already, abort
2. Create a post on Bluesky and store a reference to the at-protocol URL
3. Create a post on LinkedIn and store a reference to the post

As a part of this process, I've also had to

- Remove all of the social-media posting stuff from my blog. It has always felt like a scope-creep to have it here, so now it's a part of my n8n setup and if that dies, that's not the end of the world.
- [Redo how I'm generating open-graph images](https://andri.dk/blog/2025/takomi-og-image/) because my earlier way of doing it didn't feel quite right.
- Setup hosting and automatic deployments on my own server via Dokploy

Did you do anything interesting with your Holiday Vacation?
