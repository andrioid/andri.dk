import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { CAR_BRANDS, insultCarImagePrompt, insultCarPrompt } from "./cars";
import { getCountryFromIP, getIPfromHeaders } from "./country";
import {
	aiImage,
	insultCountryImagePrompt,
	insultCountryPrompt,
	promptAI,
} from "./country-ai";
import { COUNTRIES } from "./country-list";

export const insults = {
	insultMyCountry: defineAction({
		input: z.object({
			country: z.enum(COUNTRIES),
		}),
		handler: async (
			input,
		): Promise<{
			insult: string;
			image?: string;
		}> => {
			const country = input.country;
			if (!country)
				return {
					insult: "I couldn't figure out where you're from. So no insult for you.",
				};
			const insult = await promptAI(insultCountryPrompt(country));
			let img = undefined;
			try {
				img = await aiImage(insultCountryImagePrompt(insult, country));
			} catch (err) {
				console.error("Image generation failed", err);
			}

			console.log("[Insult] " + insult, img);

			if (insult)
				return {
					insult: insult,
					image: img,
				};
			return {
				insult: `Something went wrong`,
				image: img,
			};
		},
	}),
	getCountry: defineAction({
		handler: async (_, ctx) => {
			let ip = getIPfromHeaders(ctx.request.headers);
			//console.log("! getCountry", ip);
			if (!ip) {
				//ip = "193.4.194.2";
				//ip = "77.75.80.174"; // dk
				console.log("!!! No ip found for client (normal for dev)");
				return;
			}

			try {
				return getCountryFromIP(ip);
			} catch (err) {
				console.error(err);
				return undefined;
			}
		},
	}),
	insultMyCar: defineAction({
		input: z.object({
			brand: z.enum(CAR_BRANDS),
		}),
		accept: "form",
		handler: async (input) => {
			const insult = await promptAI(insultCarPrompt(input.brand));
			let img = undefined;
			try {
				img = await aiImage(insultCarImagePrompt(insult, input.brand));
			} catch (err) {
				console.error("Image generation failed", err);
			}

			return {
				insult,
				image: img,
			};
		},
	}),
};
