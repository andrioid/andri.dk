---
path: '/blog/2019/08/react-redux-go-webassembly'
date: '2019-08-30T00:00:00.000Z'
title: 'React Redux, with Go reducers in Webassembly'
tags: ['react', 'redux', 'go', 'webassembly']
draft: true
---

If you're reading this, you must be wondering if this is some sort of a click-bait. Why on earth would someone mix React, Redux, Go and Webassembly? Well, I'll tell you!

# Introduction

I've been using Redux for a few years on my React projects, and for a couple of years, I've been interested in event-sourcing and Domain Driven Design (DDD). While those two things appear to be unrelated, they're actually quite similar.

## Flux and Redux

explain what it is

## Event-sourcing

explain what ist is

## Get to the point already

Redux frontends and Event-Sourced backends have a thing in common. Reducers.

A common pain-point in event-driven systems is that the read-model is eventually consistent. You can't write, and then read the data right away without first knowing if the read-model has been updated.

If you've ever seen a checkbox get checked, and then unchecked after a few milliseconds, then you've seen a guess-work gone wrong. But, we don't need to guess. We can compile our business-logic from Go to WASM and then use it as a reducer on the frontend.

That way, the chances of the post-operation data looking the same on the frontend and backend go up somewhat.

# Building a shopping cart
