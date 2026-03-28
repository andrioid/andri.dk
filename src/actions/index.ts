import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { paskar } from "~/actions/paskar";
import { insults } from "./insults";

export const server = {
	contactMe: defineAction({
		accept: "form",
		input: z.object({
			email: z.email(),
		}),
		handler: async (input) => {
			console.log("EMAIL YEAH" + input.email);
			return `Hello, ${input.email}!`;
		},
	}),
	insults,
	paskar,
};
