---
title: Old dog, new tricks
date: "2026-05-25"
tags: [ai, programming, rant]
---

As an old school programmer, I thought I'd write down my journey into agentic AI and reflect on it.

### Why I love programming

I've been programming for as long as I remember. My parents bought an Amstrad CPC 128k (yes, that's the RAM size) and I was immediatly hooked, at the age of 8. After getting bored of the computer games it came with I turned my attention to the manual. It, being in a foreign language didn't stop me either.

Solving non-trivial problems is my passion and I've been using the computer to do that for a long time. I'd spend my entire workday programming, and then go home and work on side-projects.

### Books as a reference material

Back when I was learning programming we had to rely on programming books to learn the syntax. There was no Stack Overflow, ChatGPT or even Google.

As the web matured, I hardly ever look at programming books. The Internet has a more up-to-date reference than paper could ever keep up with.

### Era of AI auto-complete

When these large-language-models (LLM) started drawing attention I thought I'd try them out. My first impression was that they were a good way to look up documentation, code references and large amounts of text, as long as you were critical of the output.

Copilot, Cursor and code-completion were all the rage; but I found them more _distracting_ than helpful. At this point I'm was using ChatGPT daily to look things up, but I didn't want these things touching my code or break my rhythm.

### Coding Agents. Are they good now?

I was late to the party, but in 2026 I decided to give coding-agents a shot. I didn't really know what to expect, since the quality of what AI delivered was so bad. I had a tedious task of updating popular library that was interconnected all over the place. I could've done it by hand; but it probably would've taken a week.

Then the agent and I started planning. This was fundamentally different from telling it to do stuff and be disappointed. I was using the AI to explore and brainstorm a potential solution and the output wasn't code. The output was a markdown plan file. Only when I thought the plan was worth working on, would I let it start editing.

_I was blown a way_.

If the plan was good, it would produce mostly good code. Not hand-crafted, beautifully abstracted masterpiece of code. But, working code. I've worked for companies that used outsourcing, and I dare say that agentic-coding is far superior to handing over a project to an outsourcing company, only to throw it away 6 months later.

Not because the code is better, mind you. But, because of a much faster feedback loop.

### Beyond tedious tasks

After offloading boring, time consuming tasks to AI, I was curious how it would fair at building stuff. But, I wasn't ready to let AI loose at the production codebase at work. Enter my graveyard of side-projects!

I get many ideas. And for years, I've been writing the idea, with a rough solution down in my notes and forget all about them. I've been doing that for years. Sometimes I'd do a prototype, buy a domain-name and _then_ get bored of it.

First project was something I've wanted to do for a long time. Block ads via HTTP proxy instead of relying on browser extensions and after brainstorming on a plan for over an hour the agent asked me: "Ready to implement?". "Ehm, sure!". From my earlier experience I was skeptical of just letting it rip. So, I decided to force it to do Test Driven Development (TDD) in Go. After 2 evenings of hand-holding I had a working proxy server. This would've taken me months to do by myself.

Second project was a frustration with web templating in Go. I was surprised and annoyed by a lack of typings between Go code, and the standard templates. After a night of brainstorming with the agent it also ended with "Ready to implement?".

Both projects are working and relatively stable.

### The mental trade-off

As many software developers are now learning, streaming text into your brain all day is exhausting. A normal day of a software development might consist of investigating an issue, talking to stake holders, talking with UX, drawing up a rough solution and iterate on the code.

All of these steps include a break, personal contact and often blockers. With agents, you are suddenly the bottleneck between the backlog and production. That's stressful.

Humans are also lazy by nature. What happens to a product when the feature is written by AI, the UX is done by AI, the programming and reviewing is done by AI? Who is steering the ship?!

### Code Craftsmanship

As someone who likes to discuss design-patterns, security, testability, data modelling and other weird topics I'm concerned. Not because these things are less important now - but because it's _too easy_ to offload these tasks to AI.

Writing code was never the hard problem. Production software isn't just some functional requirements in JIRA, mashed together with ones and zeroes. There's a business domain and a very long list of past decisions that might or might not be documented somewhere.

As Software Developers, we need to pick our battles. We probably won't be deciding where that curly-bracket is sitting or the name of each variable, and that's fine. But, we definitely should be thinking more about software architecture, design patterns and **not** delegate that to the AI.

### Security. What security?

I remember someone giving me the sage advise of "Always validate your inputs". Yet, letting Claude access all your online services, your computer and run terminal commands on your computer is normal now. Where does Claude get its' input from? Well, _everywhere_. Everything it reads from your files, your skills and online resources can affect its' behavior.

What makes it worse is that we can't validate agent communication like we'd do with web-forms. Anthropic is famously using regex in their harness and hard-coding dangerous commands. The best solution I can think of is putting everything in a sandbox and regulate the sandbox according to the purpose of the specialised agent.

There are going to be some _terrible_ casualties on the stock-market when prompt-injection really takes off.

### Conclusion

As you may have guessed by reading this far, I'm conflicted!

What it eventually comes down to, is money. Is the potential _reward_ worth the _risk_ of burned out developers and lack of security? Maybe.

My personal take. If we can get the security part to a reasonable level, then I think that humans should focus on strategy and let the machines do tactics. I will keep using AI for investigating code-bases, summarising large amounts of information and code tasks. But, I will write my own emails, articles and abstractions and force myself to take breaks during the day.

Let's not outsource our thinking. We might forget how.
