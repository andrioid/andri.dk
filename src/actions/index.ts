import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { paskar } from "~/actions/paskar";
import { insults } from "./insults";

export const server = {
	contactMe: defineAction({
		accept: "form",
		input: z.object({
			email: z.string().email(),
		}),
		handler: async (input) => {
			console.log("EMAIL YEAH" + input.email);
			return `Hello, ${input.email}!`;
		},
	}),
	insults,
	paskar,
};
