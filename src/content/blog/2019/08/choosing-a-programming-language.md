---
date: "2019-08-04T00:00:00.000Z"
draft: false
ogImage: 2019/08/choosing-a-programming-language.png
slug: 2019/08/choosing-a-programming-language
tags:
    - programming
    - discussion
title: Choosing a programming language
---
Imagine that you're a CTO, a Tech Lead or someone that has to make an early technical decision that will effect the company for years to come. What programming language do you choose?

# The cost of abstraction

Systems tend to have two types of complexity. Complexity from the business-domain, and complexity from the technical-domain. In my experience, the technical-complexity takes up more room than it should.

There are, of course brilliant programmers out there, who manage complexity really well, regardless of what language they code in. But people have different skill-sets, and a great team has many different types of members.

# Readability

When I took my first programming job, I was looking forward to "writing some awesome code". But, writing code wasn't my primary job. Reading it was.

There are some tools that help manage this. Coding-standards, linters, code-formatters all try to make reading each other's code easier.

But what if every feature of our programming language, comes with a cost? If you give 10 programmers the same task, how similar would the implementations be? I argue that if you get many different types of implementations, then your programming language is too complex.

To be productive at writing code, we also need to be productive at reading it.

# Dependencies

At a certain point we need something from our programming language that isn't a language-feature, but a library feature. We need to open a file, parse HTTP headers, decode JSON, or talk to databases.

Every dependency we add to our programs comes with a price, even if the code is free. What if the maintainer get's hit by a bus? What if the maintainer becomes malicious? What if there's a critical security bug?

Why did PHP win over Perl for web-development in the late 90's? I'm willing to bet it was because PHP's standard-library was so good, and well documented.

Another approach is Javascript's NPM where there is no standard library. Every little thing has it's own package. The advantage has been that the community of JS really stepped up and you can find a package for any thing you can imagine. The disadvantage is that with nested dependencies, we have no idea on what code we're actually depending on. There hasn't been a NPM apocalypse yet, just the story of left-pad and an occasional bitcoin miner.

I think this a no-brainer. If we're building something that needs to be reliable for years to come, then we need a standard library that has security updates and advisories when shit happens. And remember, that we don't include dependencies, we adopt them.

# Hiring people

At some point, we all need help. And that help usually comes to us by means of hiring people. If it wasn't for this point, I might be programming in Erlang, Elixir and Elm right now. I think these languages are extremely interesting, and not just because they all start with the letter E.

But reality sets in, and we need a pool of people to hire from, that either know your tech-stack or will have an easy time learning it.

The exception is when an organization has decided to invest in something, has a resources to teach newcomers and is willing to pay premium for talent.

# Performance

Performance is important. But, aim for "good enough" instead of "perfect". "Perfect" will almost certainily have a downside in other parts of this post.

Does your project require some hard-core performance? Systems that have a "hard" real-time requirement might limit your choices. "Soft" real-time is still doable in almost any language.

We once programmed in a world of a single CPU. That world is no more. Please pick a langauge that handles multiple executions well.

A practical example would be a checkout-API call on a webshop. The customer has submitted a payment token, an order, and an email we need to verify. None of these things depend on each other, but all three things need to complete to succeed.

# Developer Experience

To me, a good developer experience consists of the following things.

- The code is easy to read and understand.
- The language is supported in my editor (or IDE) of choice.
- There is a good, _reliable_ debugger available.
- Easy to write and run tests, both locally and in build-systems.

# Final words

We try to plan for the future, but nobody really knows it will bring. So, aim for the next 5 years and then time will tell.

What language would you pick, and why?
