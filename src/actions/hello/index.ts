import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCountryFromHeaders } from "./country";
import { greetingPrompt, promptAI } from "./ai";
import { COUNTRIES } from "./country-list";

export const hello = {
  getGreeting: defineAction({
    input: z.object({
      country: z.enum(COUNTRIES).optional(),
    }),
    handler: async (input, ctx) => {
      const country = input.country;
      // if (country === undefined)
      //   country = (await getCountryFromHeaders(ctx.request.headers)) as
      //     | (typeof COUNTRIES)[number]
      //     | undefined;

      // https://discord.com/channels/830184174198718474/1295282295510405202
      // TODO: Revisit this. Can't find the IP in the Astro request
      if (!country)
        return "I couldn't figure out where you're from. So no insult for you.";
      const greeting = await promptAI(greetingPrompt(country));
      if (greeting) return greeting;
      return `Something went wrong`;
    },
  }),
  getCountry: defineAction({
    handler: async (input, ctx) => {
      try {
        return getCountryFromHeaders(ctx.request.headers);
      } catch (err) {
        return undefined;
      }
    },
  }),
};
