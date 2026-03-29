import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import GithubRepo from "./components/github-repo.astro";

const blogCollection = defineCollection({
	loader: glob({
		pattern: ["**/*.md", "**/*.mdx"],
		base: "./src/content/blog",
	}),
	schema: z.object({
		title: z.string(),
		// TODO: use z.coerce.date() ?
		date: z.string().transform((str) => new Date(str)),
		draft: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
		coverImage: z.string().optional(),
		ogImage: z.string().optional(),
		language: z.enum(["en", "da", "is"]).default("en"),
		social: z
			.object({
				bluesky: z.string().optional(),
			})
			.optional(),
	}),
});

const projectCollection = defineCollection({
	loader: glob({
		pattern: ["**/*.md"],
		base: "./src/content/project",
	}),
	schema: z.object({
		title: z.string(),
		yearStart: z.number().optional(),
		yearEnd: z.number().optional(),
		status: z.literal(["paused", "ongoing", "finished", "abandoned"]).optional(),
		blogTag: z.string().optional(),
		github: z.string().optional(),
		tags: z.array(z.string()).optional(),
		url: z.url().optional()

		// body is elevator pitch
	})
})

export const collections = {
	blog: blogCollection,
	project: projectCollection
};
