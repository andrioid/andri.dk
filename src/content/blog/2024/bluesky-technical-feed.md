---
title: Technical Scrolls for Bluesky
date: "2024-12-31T00:00:00.000Z"
tags: ["tech", "bluesky", "atproto"]
---

I've always been interested in technology, and not much else. When social networks emerged I was excited for all the technical content I'd have access to. Unfortunately big-tech has no interest in allowing us to control how we consume content. Facebook started out with allowing you to select all your interests so that they could better show you interesting things. Typing this out loud now, makes me think I was incredibly naive. Of course they did that so they could show me interesting _ads_. Twitter somehow was different, because I could selectively follow people who posted things that were interesting to me.

Try out [Following Tech](https://bsky.app/profile/technical.scrolls.org/feed/tech-following) or [Technical Scrolls](https://bsky.app/profile/technical.scrolls.org/feed/tech-all) and DM [me](https://bsky.app/profile/andri.dk) on Bluesky if you have any feedback.

### Selectively following

For a while, I got my fix of tech news from Twitter from a carefully selected group of people who mostly posted technical stuff. The "problem" with that approach, is that people are human and post things that _they_ like. Google+ had an interesting concept of "circles" where you could post carefully curated content and people could only follow what they were interested in. Problem is, people don't like to do that and of all the people I had on G+, I was the only one using circles. People want to post whatever is on their mind, and that is perfectly understandable.

Now, you might be reading this and thinking that I must really hate people and their people posts. Not really. It's a matter of context. I may enjoy reading about what my friend had for lunch or see a drawing that their kid made for them. But, that does not mean I'm interested in kid-drawings or lunch photos for people I have no personal connection to.

So the closer you are to me, the more interested I am in reading whatever it is you're thinking. So, I have been pruning the list of people to follow for years, and sometimes that means missing out on some great, interesting content and engaging with interesting people who just wanted to share stuff they like.

## Vision

I want a place on the Internet where I can read interesting technical posts. Experiences of problem solving, new libraries, JS framework of the week, crazy experiments or anything like that. Without the noise.

### Enter Blue Sky

I was more invested in Mastodon/ActivityPub and even attempted to host my own personal instance for a while. It had it's upsides, but the protocol requires you to store a bunch of stuff that really has nothing to do with you or your users.

So when Bluesky started to get popular I had my doubts. Then Elon Musk and Donald Trump happened and Bluesky was flooded with millions of people and I saw a clear uptick in interesting technical content on the platform. But, that also came with what I would consider "noise". I get my fair share of "current events" from other sources, so I absolutely don't want to read about that here.

### How hard can it be?

Every engineer probably has mumbled those words. I had read that Bluesky had this concept of "label services" and I immediately wanted to see if I could build a labeler for "technical" / "non-technical". But, after reading more about [atProto](https://atproto.com/) I came to the conclusion that labeling everything that _was not_ tech related would be an impossible task and add noise to an otherwise impressive protocol. Labels were meant as a form of moderation; to label what might be sensitive to others.

### Feeds

If labels are an exclusion-list, then feeds are an inclusion-list. That sounded like the Internet I wanted, so during the Christmas holidays I started prototyping. I was put off by the amount of libraries and dependencies the examples were using; but eventually came across a few great examples of feed generators that were minimal in nature.

Then I created a feed that always showed a single post, using a HTTP endpoint. The only library used was the "@atproto/api" for registering the feed. Initial prototypes used Bun and almost no external dependencies.

OK, let's do this!

## Tech Stack and challenges

I needed a web-server for `/xrpc/app.bsky.feed.getFeedSkeleton` and `/.well-known/did.json`. I needed somewhere to store the posts, their classification and I also wanted to build some moderation tools to make it easier for me to debug the classifiers.

- TypeScript and Bun
- [Astro](https://astro.build) for the web-application in SSR mode
- Postgres, Drizzle-ORM with postgres-js
- React (as Astro interactive islands) for the moderation tools

### Jetstream

The Bluesky firehose is massive and I'm not at all interested in burning a hole in my pocket while trying to process all of the 30 million users worth of posts. So, I opted in for using the [Jetstream](https://github.com/bluesky-social/jetstream) service and only subscribe to posts followed by my users.

I tried some libraries, but the most promising one had an issue with Bun and none of them supported compression. So like any overly optimistic programmer, I made my own. It's specifically designed to my use-case of requesting only the `DID` (user identities) I want from the service instead of "all posts". The Jetstream service supports up to 10000 accounts per socket and state that I can open as many sockets as I want. Challenge accepted!

My initial attempts went well, but as soon as I approached 200 accounts the socket refused to connect. I suspect that my query-string was too long, but I was a big issue, since even with _one_ user (me) the service was opening 3 sockets.

Reading through some of the other libraries, I came across an option of Jetstream to update it's configuration through the socket instead of requesting it through the URL. That worked wonders, and I could easily fit all the requested accounts in one socket.

Looking at the posts quickly filling up my terminal's buffer I decided that I needed to get that stream compressed before I get a call from my ISP. Finding a zstd library was easy, but finding one that supported Bluesky's custom dictionary was harder. I finally found a great library called [@bokuweb/zstd-wasm](https://www.npmjs.com/package/@bokuweb/zstd-wasm) and quickly had the compressed stream working.

### Classifier

You can't have a feed without knowing sort of what posts you want in your feed. I wanted something simple in the beginning so I'd have some content while trying to figure out the best way to classify posts as tech/non-tech. The first few classifiers use regular expressions to mute or tag posts according sentences that I've hard-coded. But, I designed the data-model so that any post can be tagged multiple times by different algorithms. That way, I could start simple and then bring GPT and friends if I came across a big pile of money.

Next attempt was creating my own naive bayes classifier; but I ended up spending more time than I had fine-tuning the tokenizer function and still wasn't seeing the results I wanted. But, at this time I knew I needed a way to manually classify posts to train the models.

I was desperate, so I reached out to ChatGPT. It was quite helpful, and suggested Tensorflow JS with a bit back and forth, ChatGPT and I were able to stitch together a promising tokenizer and bayes classifier. I then started to consider how I was going to store the model and it seemed that the Tensorflow either want you to use local-storage (browser) or raw files (node). But, I didn't want that... I wanted to store this in my trusty Postgres.

So, I wrote a custom `IOHandler` implementation, that was able to load and save models from the database with the dictionary.

### Web application

What I want from the web application is to serve the feeds, be able to preview the feeds and most importantly, be able to classify manually. All of the API calls are implemented as Astro Actions (type-safe and zod validated).

I work with React in my day-job, so it felt natural to grab it for my moderation tools. Being naturally curious, I decided to go for React 19, fresh off the shelf and try their new `use()` function. Then my development environment started hammering the Bluesky API every few millisecond. Sorry Team Bluesky. After a few hours of scratching my head, I found out that the `use()` function is intended for content from react-server-components and any promises created on the client is re-created on every render. If you ask me, that's an accident waiting to happen. We (React users) have been hoping for a simpler way to consume API's on the frontend and I really thought that `use()` was it.

To preview the posts I started out with using [react-embed-bluesky](https://github.com/hichemfantar/react-bluesky-embed), which is excellent but intended for creating engagement on the platform. I wanted a simple preview, with moderator tools. But, it was a great inspiration - so thank you [Hichem](https://github.com/hichemfantar).

### Database

I can't end this post without saying a few words about the heart of the solution. I've been programming professionally since the late 90's and was always a MySQL person. But, since I finally learned Postgres there really isn't any competition. Postgres is a work-horse and while it may not be best at everything; it's good enough at surprisingly everything.

I'm using Postgres to store posts, tags, classifier models and not to mention listen/notify that helps my processes communicate what posts need processing without me needing to invest in a full blown queue solution.

I've written harsh things about ORM (Object-Relational-Model) libraries, but [Drizzle-ORM](https://orm.drizzle.team/) fits a sweet spot for me. It's strongly typed and it makes querying and storing stuff incredibly easy - just like every ORM. But, Drizzle has this wonderful "Magical `sql` operator" as they call it. As with any library, you will eventually find a use-case that it wasn't created for. But, with Drizzle you can use whatever SQL syntax your heart desires. So, I've come to like Drizzle very much.

The database is running on a small 512M node and it has performed admirably.

## Conclusion

The service is running and mostly churning out technical content, but the holidays are soon over and I have other things to occupy my time.

### What I'd really like to work on

In no special order

- I'd love a "Programming memes" feed. It could be done by applying image classification models on. That would also mean more image content in the feed.
- The services are leaking memory, and I can't tell if it's my crappy programming or some edge cases in Bun. I'd love to figure out why, and fix it.
- So far the focus of my classifiers has been "relevancy" or figuring out if something is "tech" or "not". When the [Technical Scrolls](https://bsky.app/profile/technical.scrolls.org/feed/tech-all) feed is so busy that it's unusable, I hope to spend some time on figuring out what's "trending" and "good" somehow.
- If this gets popular I will need some help to train the models, and to do that I will have to do what I've been dreading. Implement oauth login and sessions.

This has been a really interesting project and I've learned a lot. Specifically about how Bluesky and atProto work, machine-learning and how (not) to write long-running JS services.

Still reading? Well, thank you so much. That means a lot!
