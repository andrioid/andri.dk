---
title: "Gastro: Server side web framework for Go"
date: "2026-04-06"
tags: [go, webdev]
---

### Writing web applications in 2026
I've been creating web pages for a long time. I started with Microsoft Frontpage, graduated to plain HTML (think table layouts, font color, limited css) and then when PHP v3 dropped I started building web applications.

These applications were all server rendered, and when Google released Gmail/Calendar and everyone was like "The browser can do what?!". Then the user-experience we were offering with our template languages wasn't up to the task anymore. So, we adjusted and added jQuery to our applications with a splash of Bootstrap and it was OK for a while.

Then as the projects grew, these jQuery scripts grew from helpful to unmaintainable and we were starting to build business logic in two places. At the time, I championed for React (Grunt/Gulp, React Classes) to save our sanity and became a spokesperson for React for everyone who asked, and lots who didn't. The promise of composability was too strong to ignore!

Fast forward to 2026, and everything is React. We no longer use classes, but have sprinkled useEffects, dependency arrays and state all over the place. This has brought some serious complexity to web development to the point that people complain about JS fatigue (well before AI fatigue). Newly scaffolded projects have somewhere between 500 and 1000 dependencies and updating those isn't trivial either.

For client-heavy applications (that need to be), I still enjoy using React (Native); but for most of my work related tasks of CRUD pages, tables and forms I've been feeling regret for some time now. Did we pick the right tool for the job, or did we just pick what was closest?

### Web development in Go
As I dealt with more client complexity at work, I found myself leaning more towards backend and specifically Go at home. Normal people have normal hobbies. I typically compensate for the lack of learning at work with a side-project or three.

But, writing web apps in Go isn't as nice as I thought. The built-in template engine is quite capable and widely used. But, even simple server rendered HTML pages require you to write markup in editors where you can either have partial template support, or partial HTML support. Then you have to write handlers, compile the templates, embed them and hope they run as you expected.


### Existing solutions
The closest solution I could find at the time was Hugo; but I don't want to generate static HTML. I want to write web applications, like I did with PHP when I was young.

So, I started searching; but all of the frameworks were focused on routing and ORM-like libraries and very focused on being the fastest.

[Templ](https://templ.guide) was the first Go template language where my IDE was actually helpful. It's a custom DSL that with Go syntax, that generates a `.go` file for every `.templ` file you write. I really wanted to love Templ, I did! But, the fact that I'm writing a Go project that populates my projects with generated Go files at every turn, was annoying me more than it should have.

[Gomponents](https://www.gomponents.com/) was also interesting to me. It's sort of like React, for Go. So every HTML-element has a generated function that you can use to write composable HTML with. It works, but I could never get used to writing HTML that way.

### An inspiration from Astro

I was talking to my CTO the other day how I love [Astro](https://astro.build) and how their server-side components are far superior to approaches by Next.js and others for a single reason. There is never any ambiguity about what runs on the server, and what runs on the client.

```astro
---
// Frontmatter always runs on the server.
interface Props {
    name string;
}

const { name } = Astro.props
---
<!-- body is HMTL sent to the client -->
<p>Hello {name}!</p>
```

So, Astro is great, and I almost left it at that. But, I want to write Go! I like that I can build applications with _zero_ dependencies outside of the standard library and not be horrified when the next npm vulnerability pops up.

### [Gastro](https://gastro.andri.dk) - as in gastronomy
I love food, and I wanted to recognize the influence Astro components had on the project. The goal of Gastro is:

1. Make web-development fun again
2. Learn from past mistakes.
    - PHP was too unstructured and eventually ended up in tears
    - React was an overcorrection to a painful SSR experience with modern UX
    - Static types and full IDE support for a great developer experience
3. Use AI to do the heavy lifting
4. Server Side Rendering (SSR) only.
5. `gastro dev` will listen for changes and generate all the code in `.gastro/`.
6. `gastro build` should generated a binary, embedded with all assets and be ready to ship

Let me address the AI elephant in the room first. I enjoy writing code, and solving problems. But, as someone who has abandoned more pet-projects than most start in their lifetime; I like that I can outsource the tedious stuff, so I can focus on the actual problem solving.

### A typical Gastro project
After installing Gastro on your machine, a typical workflow is like below. See [Gastro's homepage](https://gastro.andri.dk) for a better introduction.


```shell
gastro new awesomesauce # scaffolds a new project
cd aweseomesauce
code . # launch vscode (search for Gastro in the extension marketplace)
```

This will prompt you to install Go, gopls and Gastro (if you don't have it already). The project structure is opinionated, and simple. 

- `/components`: Put re-usable elements here and call them from pages. Components can call other components.
- `/pages`: Any `.gastro` component will be treated as a page and added to the generated routes.
- `/static`: Public assets are embedded and shipped. Accessible from `/static` on the server.
- `main.go`: _Your_ main project file. Here you can setup http multiplexing, move domain-logic into packages or whatever floats your gravy-boat.

### Pages
Here we import a component using a special `.gastro` import statement. Title is exported (upper-case) to the template and validated in the template by our language server.

```
---
import (
	Hello "components/hello.gastro" // Imports Hello component
)

Title := "Welcome to Gastro" // Uppercase makes it visible to the template below
---
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>{{ .Title }}</title>
	</head>
	<body>
		<h1>{{.Title}}</h1>
		{{Hello (dict "Name" "sup")}}
		{{.Title}}
		<p>Edit <code>pages/index.gastro</code> to get started.</p>
	</body>
</html>
```
### Components
The `Props` type defines what the props look like, and `gastro.Props()` makes them available in the frontmatter in a type-safe way. The ensures the language-server can verify and autocomplete the template variables in the body.

```
---
type Props struct {
	Name string
}

p := gastro.Props()
Name := p.Name
---

<div>
	<p>Hello {{.Name}}</p>
</div>
```

### So, we're back to 2002?

Not exactly. In 2002 we didn't have web-components, JS modules in the browsers or hypermedia libraries like [htmx](https://htmx.org/) and [datastar](https://data-star.dev). Modern CSS can also do many things that we previously needed JavaScript for.

I think we can have our server-rendered cake, and eat it too! I'm pretty happy with how the design turned out, and I think this is a sweet spot between composable HTML and the complexity that usually follows.