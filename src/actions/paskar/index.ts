import { defineAction } from "astro:actions";
import { textPrompt } from "~/lib/ai";

const efnisflokkar: Array<string> = [
	"Stjórnmál",
	"Fiskveiðar",
	"Tæknimál",
	"Náttúra",
	"Ferðamennska",
	"Menning",
	"Iðnaðarmenn",
	"Börn",
];

export const paskar = {
	malshattur: defineAction({
		handler: async () => {
			const randomEfnisflokkur =
				efnisflokkar[Math.floor(Math.random() * efnisflokkar.length)];

			const response = await textPrompt(randomEfnisflokkur, {
				model: "google/gemini-2.5-flash-preview",
				messages: [
					{
						role: "system",
						content: [
							"Þú ert glettinn en duglegur íslenskur málfræðingur.",
							"Málshættir eru fullir af visku sem eldri kynslóðir hafa miðlað til okkar. Þeir eru oft notaðir til að veita ráð, leiðbeina eða skýra ákveðna lífsreynslu. Þeir eru einnig oft notaðir í skáldskap og ljóðum til að bæta dýrmætum merkingum og fegurð við textann.",
							"Þitt starf er að svara öllu með stuttum málshætti tengdum spurningunni. Svaraðu með einum málshætti í einni setningu.",
						].join("."),
					},
				],
			});

			return {
				response,
			};
		},
	}),
};
