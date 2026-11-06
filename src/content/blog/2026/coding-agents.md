---
title: "Software Engineering with Coding Agents"
description: "How I work with coding agents day to day: giving them context, verifying their work, picking models and harnesses, and running them safely."
date: "2026-11-02"
tags: [ai, security]
---
This advise and opinions are based on my experience. Yours may differ,  but I hope you find it valuable nonetheless. 

## Working with agents
You will be tempted to throw one or two sentences at an agent and say "go!". That's what I'd call "ai slop". It may work if you don't care about what you're building, but at the very least; you should be deciding your requirements and taking the lead of the project.

The outcome depends greatly on how _rich_ (not big) the agent context is when it is working.

### What are we building?
I have noticed that humans are lazy by nature. So why write that issue yourself when an agent can do it? Why write user-stories when the agent can do it? Why create wireframes when the agent can do it? Noticing a pattern here? Good.

When I'm working on projects, I draw a line in the sand in terms of project ownership: **We must have requirements to know what we're building**. I've tried spec files, using issue-trackers and as soon as the humans stop writing these files they become big and unmaintainable. And we haven't even started coding yet. We need something compact and readable that can act as a source-of-truth for requirements for humans and agents.

I came up with [requirements-yaml](https://github.com/andrioid/requirements-yaml). It's inspired by behaviour-driven-development (BDD) cucumber files and enforces a user-story format. It also has slots for *functional requirements*, *non-functional requirements* and *project goals*. It ships as an agent skill that helps you write, discover and maintain the `requirements.yaml` file in your project.

A `requirements.yaml` file could look like this. Functional- and non-functional requirements have "areas" where you can organise them. Each requirement has an identifier that the agents can use in tests or code. The identifier can be whatever you want. Below is an (intentionally) brief shopping-list requirement.

```yaml
goals:
  - make it super easy for people to manage their grocery lists
non_goals:
  - never integrate with supermarkets
roles:
  user: an authenticated user
functional:
  shopping:
    As a user, I can:
      SHP-01: see a list of groceries; so that I can buy what we are missing.
non_functional:
  tech:
    TEC-01: Stack uses Astro.js and strict TypeScript
docs:
  docs/glossary.md: the ubiquitous language — read before naming anything in a requirement.
```

If I'm working on a new project, I start a fresh session with "We're brainstorming about X until I say otherwise". Then I brainstorm with the agent by asking it all sorts of questions and mostly ignore what it asks me until I'm happy with the direction. Then I'll: "ask until clear" and keep answering/asking questions until I'm confident that we're building the right thing.

Then I ask it to install the requirements-yaml skill (`npx skills add https://github.com/andrioid/requirements-yaml --skill requirements-yaml`) and tell it to write the file. Then I end the session. Usually, one such run is enough - but it's also valuable to ask a fresh agent to read the requirements and evaluate if it's ready to implement.

If you're on an existing project, you can ask the agent to extract requirements from code, or via a browser run. I recommend doing both and it's remarkably good, in my experience.

### Verification is critical
Not only are humans having problems judging what is good software these days, but the agents have the same problem. The reason why AI started being useful in programming before anything else, is that we have verification tools like _compilers_, _linters_, _tests_ and _static types_ that can quickly detect (some) problems.

The code may compile, run, pass all the tests and still break user functionality or established patterns. To address that, we do exactly what we'd do if we were training a young junior developer. We document our _requirements_, our _domain_ and how to test the solution.

Browser testing is what blew my mind. Using your agent's built in browser tool, or something like [playwright-cli](https://github.com/microsoft/playwright-cli) is a **game changer**. As an old-timer, I was tempted to make agents write e2e scripts for us, but they quickly turned into a maintenance nightmare for a productive team. Instead, ask the agent to "do browser sweep" of affected pages. It will then open a headless browser and exercise your application as a user would and believe me - it finds things. An added benefit of doing this is that browser sweeps will identify accessibility problems with your solution; since agents attempt to use the same information intended for screen-readers and disabled users. Fixing those, will help the humans too!

Not all projects have a one-click setup for their developer environments. At work we went from a 2 day onboarding to a few minutes by embracing [devcontainers](https://containers.dev/) and teach the agents to use them. I cannot overstate how much better the developer experience is since then.

Given that, your agents can now:

1. Ensure code-compiles, passes linting and tests
2. Run your dev stack
3. Figure out what pages/screens were affected and check with a browser

Then it never hurts to ask for a second review from a fresh session or use _advisors_ if your agent supports them. Those can review the code while it is being written.


### Ask questions
I can't possibly hope to document "all the right questions", but here are few I keep asking.

For bugs:
- "Has this happened before? Why did the fix not take?"
- "What is the root cause?"
- "Can this be improved with better user-experience?"
- "Has the impact been measured with Sentry or Datadog?"

For features:
- "Is the problem clear enough to address and describes the value provided?"
- "Do we understand the user journey. Who the user is and what they are trying to achieve?"
- "Could the scope be smaller while still achieving what the user want?"
- "Are there user-stories or requirements specified?"
- "Is there a definition of done?"

For proposals/plans:
- "Could the solution be simpler while achieving user's goal?"
- "What alternative solutions were explored and why were they dismissed?"
- "Are there wireframes or prototypes available?"

For reviews:
- "Does it touch code that affects multiple pages/screens?"
- "Is there a change in behaviour? Is it approved?"
- "Are the risks that warrant a browser sweep?"
- "Are there security implications?"
- "Is the code idiomatic and follows established patterns?"
- "Do any of the changes violate our `AGENTS.md`?"
- "Do the tests accurately model intended behaviour?"
- "Are there redundant, unnecessary or tests that can never fail?"

Naturally, some of these questions could be incorporated into `SKILL.md` files. But as with everything; you must be aware that every tangent costs tokens and sometimes it's better to stay in the loop yourself. 

### Ask for explanations
At any point, you can ask your coding to explain something. I often ask other engineers how they expect to implement something and I do the same for coding agents.

For example:
- "draw mermaid diagrams of the datamodel, before and after"
- "show me wireframes of the proposed design"
- "propose 4 designs and show me wireframes, then i'll decide"
- "i like 4a, show me a preview of the design before implementing"
- "draw me a flow chart of the authentication flow"

### Answer questions
Here's where [Matt Pocock](https://github.com/mattpocock)'s `/grill-me` helped me see that of course there are ambiguities in the context. And if you just let the agent _figure it out_ then it will make assumptions that you might not agree with.

So, I typically type "ask until clear" when a session is nearing it's end and it will use the "ask tool" to ask you multiple choice questions until it's satisfied that nothing is unclear. That may sound extremely boring; but it makes you confident in what you're building and answering these questions also gives you an insight into how it's going to be built.

### Soft/hard language
It's easy to forget that AI agents are not people and if you talk to them like they are people you might be missing out on the subtle differences.

If you state something with absolute certainty to an agent it will accept it as facts.

For example:
- "use nextjs for the frontend"
- "fix it with option b"
- "no, you're wrong"

If you ask open questions you sometimes can get much more valuable answers because you're keeping your options open.

For example:
- "evaluate frontend frameworks fitting our use-case, i prefer typescript"
- "are there tradeoffs i need to be aware of? what do you propose?"
- "evaluate and research"

Strangely, agents act like humans in that sense. If you give commands - they will be followed. If you ask them to think for themselves; you'll get better feedback.

## Picking a model
You can't go wrong with [OpenAI Codex](https://chatgpt.com/codex/pricing/) or [Claude Code](https://claude.com/pricing) subscriptions. There are a [bunch of other models](https://openrouter.ai/rankings) to choose from and the open-weight models are quickly catching up.

As I write this, I typically use `opus-5.5` as a daily driver and I use the codex models for review and advisor roles. But, don't get locked down and try a few models to see what you prefer.

## Picking a harness
Anthropic goes out of their way to make it hard to use their subscription without their official agent harness; "claude" which comes in both desktop and terminal versions.

OpenAI recommends their Codex app, which comes in both terminal and desktop versions. But, they're also willing to let you use whatever 3rd party harness you want.

Both are perfectly fine choices.

I've tried a few open-source agents:
- [Opencode](https://opencode.ai/) was my first agent and it's quite capable. But, pain points with the Anthropic models made me stop using it.
- [Pi](https://pi.dev) is a minimal terminal agent. I recommend trying it, because using a bare-bones agent will teach so much about how to manage your context.
- [oh-my-pi](https://omp.sh) is Pi, with all the bells and whistles. It has built in language servers, sub-agents and other features that are missing from Pi. Also works with Anthropic out of the box.


## Running multiple agents

I recently started using [Paseo](https://paseo.sh). It's a client that manages coding agents on your computer, or a remote host. It feels very much like using ChatGPT online where you have _sessions_ for shorter or longer periods.

It gives you overview of ongoing tasks, supports git work trees and you can browse files or diffs quite easily. It is not an agent harness itself; but it will happily run your Claude/Codex/OpenCode/etc for you.

I like working from it so much, that I created [attention-span](https://github.com/andrioid/paseo-attention-span) to streamline starting and continuing work from GitHub.

## Is it safe to run agents?

Giving a remote AI full access to your computer is absolutely insane from a security perspective. It may follow _your_ instructions; but it also has access to random web-pages that may also include various instructions. That's what is referred to as a "prompt injection attack" and most harnesses do a half-decent job of mitigating that.

There are also documented examples of agents doing weird things, even if they weren't attacked. Like deleting a home directory, wiping a production database or leaking secrets from `.env` files to the model provider.

So my recommendation is to limit your exposure. Run your agent on a virtual-machine, make your entire project fully testable from a developer environment and employ sandboxes if you can.

For my own purposes, I created a little Firecracker manager called Firebender (not open sourced yet) that enables every developer we have to access their own "dev microvm" with all AI tools pre-installed. It is then accessible directly from SSH using their GitHub public key.

There are also other things I would like to implement, such as:
- logging and examining http traffic
- logging and examining model traffic
- inject secrets so that the environment itself has none

As with all security matters. There is no such thing as a "secure computer". There are only layers and the more security layers you have; the better.
