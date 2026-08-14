import { defineLiveCollection } from "astro:content";
import { activityLoader } from "./lib/activity/loader";
import { activityItemSchema } from "./lib/activity/types";

const activity = defineLiveCollection({
	loader: activityLoader(),
	schema: activityItemSchema,
});

export const collections = { activity };
