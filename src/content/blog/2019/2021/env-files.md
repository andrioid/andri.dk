---
date: "2021-12-18T00:00:00.000Z"
draft: false
ogImage: 2019/2021/env-files.png
tags:
    - env
    - devops
    - node.js
title: ENV files
---
An environmental-variable is a way for the environment (your operating-system, or shell) to share information with future processes. Some ENV vars are global (and set by the OS), others are only useful in a certain context.

You could be using a configuration file, but the world of hosting has very much adopted the [12 Factor App](https://12factor.net) way of configuring applications. For environments like CI/CD, Heroku and Kubernetes, this makes a lot of sense.

In development though, this can be quite awkard to use.

### Example: Backend API

You've written a beautiful monolith, but it needs a couple of things to run properly. It uses a **private key** to sign auth tokens, and it uses **AWS credentials** for uploads to S3.

You decide to use ENV variables and decide on `AUTH_KEY` and `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. Then you set up your hosting, and configure your app to abort if any of those are missing.

In development though, instead of running `npm run dev`, you now need to run `AUTH_KEY=xxx AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx npm run dev`.

This is rather annoying, and might prompt you to write a blog post about ENV variables...

### Creating the .env file

Instead of defining the ENV variables every time, we can create a `.env` file in our project workspace. It usually looks something like this.

```
# JWT encoding key
AUTH_KEY=youWillNeverGuessThisYouEvilHackers
# AWS Developer Access
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

You may be tempted to check this file into source control (e.g. Git) and store with your code. **That would be a mistake**. Especially if you decide at a later point to open-source your project. Then you'd also be giving everyone access to your AWS credentials. Even if you later delete the file from your repo.

Instead, add it to your `.gitignore` file to make sure that it will _never_ get accidentally pushed with your code.

```
.env
```

It may not be 100% secure, to store stuff like this on your developer laptop, but it's still better than storing secrets in your repository.

> Pro tip: New developers on your projects may not know anything about ENV variables or your local `.env` file. So make sure you update your documentation, and provide useful error messages if those ENV variables are missing.

**Never create `.env` files for anything other than your development setup. It is very easy to accidentally expose secrets that way.**

### Reading the .env file

If we now run our backend, it will complain that our ENV variables are not set. We have to tell Node (or whatever) about those variables.

On Linux/Mac this is quite easy.

#### Pass the env-vars to MYCOMMAND

In this case `npm run dev` will have access to any ENV variables in the file.

```
eval $(egrep -v '^#' .env | xargs) npm run dev

```

#### Export the vars in .env into your shell

It's also possible to "export" the variables to your current session. That way, any command you run afterwards from the same shell will inherit it.

```
export $(egrep -v '^#' .env | xargs)
npm run build
npm run dev
```

### Node.js

It is also possible to read ENV files without doing shell-script dark arts.

#### dotenv

You can inject the ENV variables into your Node.js process like this.

```
npm install --save-dev dotenv
```

In your app.js

```js
require("dotenv").config();
```

In my experience, this is a horrible way of reading the ENV file. Remember, that this is a convenience for development. Why are we adding it to production code?

#### dotenv, without polluting your code

Add a file called `local-dev.js` to your project workspace.

```js
const { execSync } = require("child_process");

// This reads the .env file into the environment
//  and shares it with any child process
require("dotenv").config();

const [argnode, argcmd, ...argrest] = process.argv;

// Run whatever follows `node env.js` as a child process and inherit stdin/stdout/etc
execSync(argrest.join(" "), {
  stdio: "inherit",
});
```

Then in your package.json. In my example, I'm loading `.env` and then running the Remix dev-server.

```json
{
  "name": "your package"
  "scripts": {
    "dev": "node ./local-dev.js npm run dev:server",
	"dev:server": "remix dev"
  }
}
```

There are packages on NPM that do this for you, like [dotenv-cli](https://www.npmjs.com/package/dotenv-cli) or [dotenv-run-script](https://www.npmjs.com/package/dotenv-run-script). But why install a dependency for 4 lines of code?

### Notable mentions

- [direnv](https://direnv.net) can automatically load variables into (and out of) the environment as you enter directories with `.envrc` files.
