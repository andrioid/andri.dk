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
	"Íþróttir",
	"Fjölskyldan",
	"Kærleikur",
	"Vinátta",
	"Vísindi",
	"Yngri kynslóðin",
	"Eldri kynslóðin",
	"Samvera",
	"Trúin",
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

			const response = await retry(
				() =>
					textPrompt(randomEfnisflokkur, {
						model: randomModel,
						messages: [
							{
								role: "system",
								content: [
									"Þú ert glettinn en duglegur íslenskur málfræðingur.",
									"Málshættir eru stuttar setningar skrifaðar í eldra og oft tvítengdu máli og opnir til túlkunar",
									"Svörin þín eru jákvæð og uppörvandi",
									"Þú ert að skrifa málshátt sem tengist ákveðnu efnisflokki.",
									"Þú skrifar rétta íslensku og kannt að fallbeygja orð",
									"Þitt starf er að svara með stuttum málshætti tengdum efnislokki spurningarinnar",
									"Svaraðu með einum málshætti í einni setningu.",
								].join("."),
							},
						],
					}),
				3,
				50,
			);

			return {
				response,
				catagory: randomEfnisflokkur,
				model: randomModel,
			};
		},
	}),
};

// Function for retrying a promise
export async function retry<T>(
	fn: () => Promise<T>,
	retries: number,
	delay: number,
): Promise<T> {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		} catch (error) {
			if (i === retries - 1) throw error;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	throw new Error("Max retries reached");
}
