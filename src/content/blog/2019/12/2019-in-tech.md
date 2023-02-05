---
slug: "2019/12/2019-in-tech"
date: "2019-12-29T00:00:00.000Z"
title: "2019 in Tech"
tags: ["technology"]
draft: false
---

Every year, or that was my plan back in 2013; I do a review of what technology I've been using during the year and reflect on my experiences.

This year has been fun in many ways. I have been creating apps, websites, microservices and APIs.

## React

When I started playing with React 4 years ago, Angular was insanely popular in Denmark and everyone was looking at me funny. There was no standard tool for anything and every week there were major version changes in the stack.

I heard this somewhere:

> People use Angular because of Google. People use React even if Facebook made it.

Today, I look back on React with fondness. I started making web-sites back when we had `.shtml` files and `.php3`. But then something changed. We as an industry started using the browser for more than rendering markup and then we had a few broken years.

The core problem, as I see it; is that we no longer have enough information to fully generate web-pages on the server anymore. The users expect a certain amount of dynamic functionality and while it isn't hard to add small snippets, this quickly becomes unmaintainable.

Some people realized this and tried to combine one templating language for both server and client. But as soon as the initial data started to change, there were issues.

React changed all of this. We now have one language to describe UI as a function of props and state. I can't imagine doing UI any other way. It might be Svelte or Vue in the future; but components are here to stay.

## Go, the programming language

I'm sure some people consider me an early adopter, but I had my eye on Go for a very long time before I started using it professionally 3 years ago.

It's funny how I can be excited for a language that has very few features, roughly 6 years after I first started playing around with it.

It feels like being on the same team. We all use the same formatting, the standard library usually has the functionality we need and there is less friction when working with others. This contributes to what I consider to be a very productive language.

In 2019 I have created GraphQL API's, microservices and small tools and Go is by far my favourite backend language.

## TypeScript

In May, I joined a new company and they were doing all of their new code in TypeScript. The project I joined has `alwaysStrict=true` and I hated it very much. Everything I was used to do in JavaScript was now something that the compiler refused to make work. I spent 2/3 of the time defining types for something I thought was obvious.

Later, I moved to another project where we also did TypeScript with React, but without strict-mode this time. This time, it clicked for me. It helped that I had 6 months experience with TypeScript at the time, but being free to _use TypeScript_ without the feeling that I was being used by it.

Bottom line. Would I use TypeScript again? Yes. Being able to define types for props and state really speeds up development. Strict-mode? It's too verbose and results in some very ugly code without any good reason.

## Immer

I first heard about [Immer](https://github.com/immerjs/immer) over at React Europe 2018, in the context of being "better than Immutable.js", but I had absolutely no intention of doing anything, that changed all of my state data to some weird types again. So I ignored it.

Then, I was dealing with some internal state in React that included messing with items of an array. Arrays in React state is probably the most annoying part of React. It feels verbose and hard to read at the same time. This immutable dance with arrays is painful; even in modern JS or TS.

Immer is lovely. It's a function that takes the current state, gives you a "draft-state" that you can mutate. Then it produces a new output and returns it. The best part

So you can simply do

```js
import produce from "immer";
const [animals, setAnimals] = useState(["Cock", "Raven", "Dog", "Pig"]);
setAnimals(
  produce((draftAnimals) => {
    draftAnimals[0] = "Rooster";
  })
);
```

This will produce a new array with the changes applied and React will render the changes as expected.

Immer is a must-have tool in your React toolbox.

## React Native

I used to work at a company that does mobile-payments for parking. They had an app that was once a nice Xamarin application that worked on iOS and Android. But after 2 years of out-sourcing the app was unstable and unmaintainable (we spent 4 months on just making it stop crashing, without luck). I was responsible for the project and I had a feeling in my stomach that this was probably never going to be ok unless we'd invest an entire team into this.

I had tried playing with React Native when 2 years earlier, when they released initial support for Android, but it didn't feel mature at all. So, I decided to give it another shot and spent a few evenings and a weekend making a simple proof-of-concept in React Native. Long story short: I pitched it to my boss and we created a new app in React Native and Expo.

Expo was a really positive experience for me. I didn't have a big team, so being able to skip the native part of React Native was a clear win for me. All of the libraries we needed were already in Expo, so it was a no-brainer.

So when I started on a new React Native project this year, where we had to do all of the native parts ourselves, I was a bit scared. To my surprise, it wasn't as hard as I thought. I managed to do some minor changes to a Swift library without knowing anything about Swift or Xcode with help from my co-workers. And making the native bits talk to the JS bits was quite simple too.

All in all, a positive experience. Would do again.

## For 2020?

I'm starting the year with by joining an existing React Native team and I'm looking forward to help bring the project forward.

So here's hoping for another year filled with good technology. I wish you a happy new year!
