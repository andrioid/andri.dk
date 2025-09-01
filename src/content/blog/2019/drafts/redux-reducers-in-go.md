---
date: "2019-12-01T00:00:00.000Z"
draft: true
ogImage: static/img/social/2019/drafts/redux-reducers-in-go.png
slug: 2019/08/react-redux-go-webassembly
tags:
    - react
    - redux
    - go
    - webassembly
title: React Redux, with Go reducers in Webassembly
---
If you're reading this, you must be wondering if this is some sort of a click-bait. Why on earth would someone mix React, Redux, Go and Webassembly? Well, I'll tell you!

# Introduction

I've been using Redux for a few years on my React projects, and for a couple of years, I've been interested in event-sourcing and Domain Driven Design (DDD). While those two things appear to be unrelated, they're actually quite similar.

I want to use the same functions to calculate state in both backend and frontend. Both systems are event-based and if I can handle those event the same way, I don't have to contact the backend for validation.

## What we're building

Enough with TODO apps, and Hacker News clones. Let's build a simple booking system.

### Functional Requirements

We're solving booking for the city's top hair-stylist. Hairford Magnifico!

- Customer can book a service-slot
- Customer can not book a service-slot outside of opening hours (hardcoded)
- Customer can not book a service-slot if it is already booked
- Customer can not book a service-slot in the past

# Preperation

Install Git, Node.js and Go.

Basics:

```bash
mkdir magnifico-booking
cd magnifico-booking
git init
```

# Backend

Backend:

```bash
go mod init magnifico-booking/backend

```

# Frontend

Frontend:

```bash
npm install -g create-react-app
create-react-app frontend
```

## Get to the point already (MAYBE)

Redux frontends and Event-Sourced backends have a thing in common. Reducers.

A common pain-point in event-driven systems is that the read-model is eventually consistent. You can't write, and then read the data right away without first knowing if the read-model has been updated.

If you've ever seen a checkbox get checked, and then unchecked after a few milliseconds, then you've seen a guess-work gone wrong. But, we don't need to guess. We can compile our business-logic from Go to WASM and then use it as a reducer on the frontend.

That way, the chances of the post-operation data looking the same on the frontend and backend go up somewhat.
