---
slug: "2022/declarative-software-environments"
date: "2022-07-14T00:00:00.000Z"
title: "Declarative Software Environments"
description: "How I envision we can bring as much value as possible out of a software team"
tags: ["blog", "rant", "software", "devops"]
---

Someone smart, who works in infrastructure said to me recently (paraphrasing):

> We can't have secure defaults on Kubernetes clusters, because the developers require full freedom to work on the cluster

I used to work as Linux System Administrator for 6 years before focusing on Software Development (10+ years). I honestly think developers want **NOTHING** to do with Kubernetes directly. That, however does not mean they don't want it running redundantly somewhere where it "*just works (tm)*" though.

### What I want for my developers
I want the ability of _continuous delivery_. That the _feedback loop_ for a single code change is as short as possible, with as little fallout as possible. Every single developer on my team, should be able to make a change and see it through to production.

Should we then teach every developer about DNS, clusters, schedulers, Kubernetes, Helm and the differences of each cloud provider? No! That is not the best use of their time and expertise.

### Flow of a change
For a relatively standard stack, we have a database, some server code and some client code in a single repository. 

Should any of these steps fail, *abort*.
- Push to branch
	- Create a new infrastructure-environment to stage the change
	- New environment should have an exact copy of the database (partial copy if huge)
	- Migrations are run on the database copy 
	- All services (and sites) are deployed (staged)
	- End-to-End tests run
	- *Only for main/trunk branch*
		- Migrations are run on the actual database
		- All services (and sites) are deployed
		- Production is ready
	- Clean-up: Delete servers, databases and everything used in the transitional phase.

### What is a declarative infrastructure
We define "what we want", but not the the "how we want it".

- Git commit: This is how your world looks like at this very point in time
- Infrastructure as Code (IaC): Describes what servers, services should look like
- Database migrations: Describe how the database structure should like like
- API schema: Describes the API (GraphQL, OpenAPI, gRPC, etc)

### Reducing the barrier

I stated earlier, that I want every single developer to be able to follow through on a change to production. But, that doesn't mean that everyone needs to know about everything. They need to know *just enough* to being able to do their work in the best way possible.

- "Jim, our frontend developer added a field to our API specification and made a change to our app"
- "Tim, our backend developer saw a broken test due to an API change and fixed it on the backend"
- "Kim, our ops consultant changed the number of instances for our API server to 3"
- "Sim, our database admin increased the ram of our database and changed one of our INT fields to BIGINT"

In an infrastructure where this stuff is automated, they can comfortably change what they need without fearing that they have accidentally broken production.

### Conclusion
The scenario I'm describing is absolutely doable, as long as we have test-coverage (I'm not talking percent's) of the stack as a whole so that anyone on the team can act in confidence. The only thing that I'm uncertain about, is how a large production database can be cloned easily enough for this to be quick. I've seen migrations pass in flying colours on test environments, only to fail in production. The data matters, but having pipelines finish quickly is important too.

As I write this, this is wishful thinking on my part. Our automations aren't quite there yet, but I think this little rant of mine illustrates what we want for our software teams and hopefully a little insight into how to get there.

Ideally, I'd like something like this for pull-requests:
```
const environment = makeEnvironment("feature/awesomesauce", "main");
```

Then it would look for the declaration files (from earlier), make the base from "main", then migrate it to "feature/awesomesauce" and deploy it, after all the tests pass.

Do you know of anything that might fit the bill? Please [reach out](https://twitter.com/messages/compose?recipient_id=14566494).