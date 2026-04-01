---
title: Why your coding-agent should be writing Go
date: "2026-04-01"
tags: [go, ai]
---

Go (or Golang for some) may not be the best-in-class language for everything, but I think it's ideally suited for LLM coding.

The community is special in a way that is a bit differrent than communities of other programming languages. There's a strong feeling of doing things "The right way", "The Go way", "Idiomatic" and "avoid external dependencies". For this reason, I find it much easier to browse open-source projects written in Go, than say TypeScript. Solutions are similar, even if the programmers are not.

Feedback is essential to any programmer and your performance is closely tied to how fast that feedback-loop is. Go has a number of features that help with returning feedback quickly to you, Claude, Codex or even Fred.

When Google started development of Go, they were struggling with long build-times, so one of the core features of Go is that it compiles very quickly. Think seconds, not minutes. Since Go is a statically typed language it also will refuse to compile on invalid syntax or unused import.

Testing is also built into the `go` command so running tests is as simple as `go test`. This makes it easy to write unit-tests and integration tests as you go. Race conditions can be surfaced by running `go test -race`.

Where you place curly-brackets, line-lines or spaces is also handled by `go fmt` so all code looks the same.

Go also has a rich standard-library so it reduces the need to install 3rd party libraries.

### Why Go for LLMs?

When talking to programmers, their biggest complaints are things that Go is:

- Overly verbose
- Overly opinionated
- Hostile to patterns from classic OOP languages
- Lack of fancy language features

I sympathise, I do. But, all of these _negative_ things are _positive_ things when it comes to letting the AI write all your code. You want your AI written to code to be flat, easy to reason about. You want it to look like other code, so that it's easy to review it.

In a word. The code may be verbose, but it's more _simple_ than what many other languages produce.

### My experience, so far

I started using coding agents at work, as our CTO actively encourages us to try it out. Cursor and Copilot in the IDE never really clicked for me. These tools disrupted my train-of-thought in such a way that I rarely used them.

Then came Claude Code, OpenCode, Codex, etc. Changing the interface from micro-managing every line of code, to larger batches makes sense for me. I started with annoying, time-consuming tasks like cleaning up tech-debt and was pleasantly surprised. Then I connected the Sentry MCP and asked it to find root-causes of problems and that also worked brilliantly.

Then I decided to try "vibe coding" and quickly created an Expo app w. TypeScript and Jazz Tools. Next project was [ublproxy](https://andrioid.github.io/ublproxy) in Go, where I was able to leverage red/green (test-first) to create an adblocking HTTP proxy in a few days.

While I'd call both projects a success, I notice that the agent struggles more with the TypeScript codebase. Each exploration run takes longer, it makes silly mistakes where it feels like for every 2 steps forward, we take 1 step back.

The Go project doesn't suffer from this, and I challenge you to try using Go for your project.

### Reflections on the age of AI coding

I've been writing code since I discovered BASIC as an 8 year old playing with our first computer. I still enjoy writing it, but my true passion lies in _problem solving_. Leading an AI isn't that different from leading a junior developer, or a team in India - the feedback loop is just faster.

I was asked recently if I feel threatened by the AI gold-rush. I think we're going to see a big disruption in many jobs that have been considered AI-safe. However, I think that critical-thinking, domain-knowledge and the ability to understand problems has never been more important.

Learning new things is fun, and AI is just one more tool for the old toolbox. But, I imagine that there are specialists out there that haven't kept up with the times, or had any reason to. They might have a rude awakening at some point; but should remember that their _real_ value is their domain knowledge and that's not going out of style!