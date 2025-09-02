---
date: "2025-08-31T00:00:00.000Z"
ogImage: static/img/social/2025/mise-en-place.png
social:
  bluesky: at://did:plc:rrrwbar3wv576qpsymwey5p5/app.bsky.feed.post/3lx2pt6p2722u
tags:
  - devtools
  - devops
  - programming
title: Replacing Makefile, direnv, asdf and more with Mise
---

Have you ever joined a new project and then spend an entire day setting up your developer-environment? Worked on a large project where one of the many tech-debts are that nobody updated the runtime for 10 years, and now nobody dares touch it?

- "What version of Java/Python/etc do I need to run the backend?"
- "How do I start a dev server?"
- "Can you send me that ENV file we use for DEV?"
- "How do I run database migrations?"
- "How do I update our SDK from the API spec?"

We'll be covering the following:

- **Tools**: How you can make sure that you and your co-workers are running the correct runtime, build-tool or CLI.
- **ENV**: Set project defaults for environment variables without forcing people to rename a `.env.default` file.
- **Tasks**: Like "npm scripts", but for any language, sub-project or monorepo.
- **Docker**: Leaner, cleaner Docker images
- **GitHub actions**: Making sure our pipelines are running the same version as you.

Note: This guide may not work well on Windows and is aimed at Linux or Mac users.

### Getting started

You'll need to install [mise](https://mise.jdx.dev). There are multiple ways of doing that, but for simplicity's sake we'll do it with a curl-pipe.

```shell
curl https://mise.run | sh
mise --version
# mise 2025.x.x
```

Now, let's create a directory called "mise/" in the root of your repository.

### Tools

Mise supports a [varity of tools](https://mise.jdx.dev/dev-tools/), and tool backends. For our purposes, we'll be asking it to install Node.js v20 and Go 1.24.

```toml
# mise.toml
[tools]
node = "v20"
go = "1.24"
```

Then we run `mise install`

```shell
# tells mise to trust the configuration in `mise/`
mise trust
mise install
```

Mise will now install your requested tool versions. You might notice that if you go into the parent directory (above your project) and try running `go version` or `node --version` it might show different versions. That is because these tool versions are scoped to your project.

You can also pop a configuration file into `~/.config/mise/config.toml` and set defaults.

```toml
# ~/.config/mise/config.toml
[tools]
# Always have Node.js LTS installed
node = "lts"
```

Now, unless specified otherwise you'll have access to Node.js LTS in other projects. Running `mise install` will update it to the latest Long-Term-Support if that has changed since last time.

Another neat thing is that when working on larger projects, you can override sub-packages too

```yaml
- ~/.config/mise/config.toml # defaults for your machine
- ~/pied-piper/mise.toml # project defaults
- ~/pied-piper/packages/algorithm/mise.toml # uses an older version of python
```

You're not limited to "dev tools" either. You can install pretty much anything that has a GitHub release, or a release page with binary files using [tool backends](https://mise.jdx.dev/dev-tools/backends/).

For example, I use the GitHub CLI to create releases on another project like

```shell
gh release create "$VERSION" --target "$GITHUB_SHA" --title "md-social $VERSION" --generate-notes
gh release upload "$VERSION" dist/*.zip dist/*.gz
```

Normally, a script like that would have to check if "gh" is even installed. But, instead I define it as a tool and let Mise handle it.

```toml
# mise.toml
[tools]
# other tools
"ubi:cli/cli" = { version = "latest", exe = "gh" }
```

### Environment Variables

You can also use these configuration files to [control your environment](https://mise.jdx.dev/environments/).

```toml
# mise.toml
# *snip* tool stuff *snip*

[env]
_.file = '.env.defaults' # Loads default ENV file
_.path = './bin' # Adds your local bin/ directory to path
VERSION = "v0.0.1-dev" # custom variable
```

There is also support for templating, file loading, redactions, secrets and more.

### Tasks

JavaScript developers might be familiar with [npm scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts?v=true). This like that, only you can use it with any programming language.

Tasks can be defined [decleratively](https://mise.jdx.dev/tasks/#tasks-in-mise-toml-files) in TOML, or as scripts in any language. Those are great for npm-like scripts that depend on each other.

Let's define our development environment in TOML below.

```
# mise.toml
[tools]
watchexec = latest # Listens for changes on the file-system

[tasks.dev]
description = "Development Environment"
run = "mise watch dev.*"

[tasks."dev:go"]
# restart if go files change
sources = ["go.mod", "**/*.go"]
description = "Go backend"
run = "go run ."

[tasks."dev:js"]
# vite is handling the file watching here
run = "npm run dev"
description = "TypeScript frontend"
```

Now, if you run `mise run dev` it will run both backend and frontend. Should any files change on the backend, it will automatically restart it for you.

For more complicated tasks (e.g. linting across packages, migrations, publishing, etc), I like to keep [file-tasks](https://mise.jdx.dev/tasks/file-tasks.html) in either `scripts/` or `tasks/` folders. You can also split your TOML tasks into files.

```toml
# mise.toml
# *snip* previous stuff *snip*
[task_config]
includes = [
    "tasks.toml",
    "scripts",
    "tasks",
]
```

Creating a file-based task is like creating a normal shell script.

```shell
#!/usr/bin/env bash
#MISE description="Deploy to Kubernetes"
echo kubectl stuff here
```

Place this in `scripts/deploy` and run `chmod +x scripts/deploy`.

```shell
mise tasks
# Name      Description
dev         your description here
dev:go
dev:js
deploy
```

In the "deploy" scenario, I might put a `#MISE depends=["build"]`, to make it trigger a build before running the deployment script.

It's also worth mentioning, that you can have tasks for each of your repository projects. So if you only wanted to run the frontend, you could run `mise run dev` from "frontend/" and have its' mise.toml configure the "dev" task for something else.

### Docker

If you've read this far, you might be thinking to yourself: "Why would I spend so much time doing this, when I need to do this again for our Dockerfile and our pipeline too?!"

You can also use Mise inside of Docker using their official image, or by running the curl command manually from a base-image of your choice.

```dockerfile
FROM jdxcode/mise:latest AS tools
COPY mise.toml .
RUN mise trust
RUN mise install

# [DEPENDENCIES]
FROM tools AS dependencies

# Friends dont let friends run containers as root
RUN useradd -m -u 1000 app && mkdir -p /app && chown app:app /app
USER app
WORKDIR /app
COPY . .
RUN whatever you want
```

If you have nested configuration files, you'd have to adjust this to copy them as well in the first stage.

### GitHub Actions

There's also an [GitHub Action for Mise](https://github.com/jdx/mise-action) from its' creator.

### Conclusion

Mise allows you to define how your development environment is set up, in one place and frees you up to focus on more important things. It can simplify containers and pipelines too.

The only thing that could make this setup more magical, would be if you could setup multi-language git-hooks for your monorepo too. Funny enough, [JDX](https://github.com/jdx) has you covered with a sibling project, [hk](https://github.com/jdx/hk).

If you find this project valuable, consider [sponsoring him](https://github.com/sponsors/jdx) on GitHub.
