import { defineAction } from "astro:actions";
import { textPrompt } from "~/lib/ai";

const efnisflokkar: Array<string> = [
	"Stjórnmál",
	"Fiskveiðar",
	"Tæknimál",
	"Íslensk náttúra",
	"Menning",
	"Iðnaðarmenn",
	"Fólkið í landinu",
	"Tölvuleikir",
	"Töpuð viska",
	"Biblían",
	"Íþróttir",
	"Fjölskyldan",
];

export const paskar = {
	malshattur: defineAction({
		handler: async () => {
			const randomEfnisflokkur =
				efnisflokkar[Math.floor(Math.random() * efnisflokkar.length)];

			const response = await textPrompt(randomEfnisflokkur, {
				//model: "google/gemini-2.5-flash-preview",
				model: "openai/o4-mini",
				//model: "google/gemini-2.5-pro",
				messages: [
					{
						role: "system",
						content: [
							"Þú ert glettinn en duglegur íslenskur málfræðingur.",
							"Málshættir eru stuttar setningar skrifaðar í eldra og oft tvítengdu máli og opnir til túlkunar",
							"Þú ert að skrifa málshátt sem tengist ákveðnu efnisflokki.",
							"Þú skrifar rétta íslensku og kannt að fallbeygja orð",
							"Þitt starf er að svara með stuttum málshætti tengdum efnislokki spurningarinnar",
							"Svaraðu með einum málshætti í einni setningu.",
						].join("."),
					},
				],
				temperature: 1,
			});

			return {
				response,
				catagory: randomEfnisflokkur,
			};
		},
	}),
};
