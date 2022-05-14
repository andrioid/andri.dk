---
slug: "2020/02/tech-choices-app"
date: "2020-02-01T00:00:00.000Z"
title: "Tech Choices: Web & Mobile App development"
tags: ["react", "reactnative"]
draft: true
---

Tech Choice is where I explain a particular tech choice that I have experience with. I do not claim that it's better than what you're currently using or a silver bullet. All this is, is a fellow developer sharing his experience.

# Web & Mobile App development

Problem statement, alternative ways of doing this. Not for "web pages", but for "web apps".

## What is React

React, in it's simplest form is a way of describing UI using a language called JSX. It looks like this:

```jsx
<App>
  <TopNavigation onMenuPress={handleOpenMenu}>
    <Image src="logo.png" />
  </TopNavigation>
</App>
```

You may look at this and think that it looks like JavaScript and XML had a really ugly baby together. I know I did when I was starting out with React.

As it turns out, it's a really nice way of describing UI. Mostly because (if you seperate your concerns) you can get a really nice declerative overview of what your UI is supposed to be doing. In comparison, I didn't have much overview of what was supposed to happen when to competing jQuery plugins were doing stuff to my templates.

React also handles app-state and how variables and callbacks flow through your application. Is it fair to call React a framework? Yes, I think so.

## Is React a safe technology choice?

The short answer is "yes". The longer answer is that it's all relative.

Software Development is not like creating wooden-toys; where once made will keep working until someone steps on them and breaks them. Software needs maintainance and if development should continue, it also needs to be kept up to date.

Programming in JavaScript (or TypeScript) has the benefit of almost anything you can think of exists as a library on NPM. It's amazing how easy it is to get a simple application out. The downside is that when you add dependencies to your project, you're also adding their dependencies and more to your project as well.

These dependencies are living things, just like your app. The have bugs, occasional design mistakes, security issues and sometimes entire API rewrites.

As long as you, the app developer or product-owner accept this; you'll be fine. You will occasionally need to look into what building-blocks your app is using and update them. Sometimes it's really easy. Sometimes we need to change how we use them. This also applies to any other JS projects that are not using React.

But you want to know if you can risk your business or your carrier on this thing called "React".

If you do, you're not alone:

**TODO add sources and links**

- (TODO: Add sources: https://brainhub.eu/blog/10-famous-apps-using-reactjs-nowadays/)
- https://www.quora.com/Who-is-using-Facebook-React?share=1

- Facebook develped React for their own purposes and continuously tests upcoming releases on their live site.
- Microsoft is using React for making their Office product suite cross platform.
- Shopify is moving all mobile development to React Native
- Netflix uses React for all of their Streaming UI
- Instagram is built using React
- New York Times uses React for their site
- Vivaldi browser uses React for UI
- Dropbox uses React
- Groupon's merchant site is built with React

## You did say cross-platform, right?

Until now I've been using React and React Native interchangibly. That is because, it's the same; really.

Let me explain.

React
React Components
React DOM / React Native (web, windows, ios, android) (insert diagram)

What React Native brought to the table really surprised me. It was giving us a common language to describe UI elements. Instead of writing text in `<p>I love bacon</p>`, we write text in `<Text>I love bacon</Text>`. This is important, because "Text" is universal, while "P" is just a DOM element.

We can easilly translate `<Text>` to a "p" or a "span"; or if you're on Android it uses the Android Text element behind the scenes.

And this is exactly what React Native Web does. It's a horrible name, because It doesn't really have anything to do with the "native" part. It just translates these universal primitives to the DOM.

Armed with JS for our logic, React to describe our UI and data and React Native (Web) we can build applications that work on Android, iOS and web. And we can build them fast.
