import { defineAction } from "astro:actions";
import { textPrompt } from "~/lib/ai";

const efnisflokkar: Array<string> = [
	"Stjórnmál",
	"Fiskveiðar",
	"Tæknimál",
	"Íslensk náttúra",
	"Bókmenntir",
	"Tónlist",
	"Tómstundir",
	"Skemmtun",
	"Iðnaðarmenn",
	"Fólkið í landinu",
	"Tölvuleikir",
	"Viska",
	"Kristin trú",
	"Íþróttir",
	"Fjölskyldan",
	"Kærleikur",
	"Vinátta",
	"Vísindi",
	"Yngri kynslóðin",
	"Eldri kynslóðin",
	"Samvera",
];

const models: Array<string> = [
	"google/gemini-2.5-flash-preview",
	"openai/o4-mini",
	//"openai/o1-preview",
	//"google/gemini-2.5-pro",
	"gpt-4-turbo",
];

export const paskar = {
	malshattur: defineAction({
		handler: async () => {
			const randomEfnisflokkur =
				efnisflokkar[Math.floor(Math.random() * efnisflokkar.length)];
			const randomModel =
				models[Math.floor(Math.random() * models.length)];

			const response = await textPrompt(randomEfnisflokkur, {
				model: randomModel,
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
				//temperature: 1,
			});

			return {
				response,
				catagory: randomEfnisflokkur,
				model: randomModel,
			};
		},
	}),
};
