type CarBrand = {
  name: string;
  models: string[];
};

export const CAR_BRANDS_WITH_MODELS: CarBrand[] = [
  { name: "Toyota", models: ["Camry", "Corolla", "RAV4"] },
  { name: "Ford", models: ["Mustang", "F-150", "Explorer"] },
  { name: "Honda", models: ["Civic", "Accord", "CR-V"] },
  { name: "Chevrolet", models: ["Silverado", "Malibu", "Equinox"] },
  { name: "Nissan", models: ["Altima", "Rogue", "Sentra"] },
  { name: "Volkswagen", models: ["Golf", "Jetta", "Tiguan"] },
  { name: "Hyundai", models: ["Elantra", "Tucson", "Santa Fe"] },
  { name: "BMW", models: ["3 Series", "5 Series", "X5"] },
  { name: "Mercedes-Benz", models: ["C-Class", "E-Class", "GLC"] },
  { name: "Audi", models: ["A4", "Q5", "A6"] },
  { name: "Tesla", models: ["Model 3", "Model S", "Model X"] },
  { name: "Ferrari", models: ["488 GTB", "F8 Tributo", "Portofino"] },
  { name: "Lamborghini", models: ["Huracán", "Aventador", "Urus"] },
];
export const CAR_BRANDS = [
  "Toyota",
  "Ford",
  "Honda",
  "Chevrolet",
  "Nissan",
  "Volkswagen",
  "Hyundai",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Tesla",
  "Ferrari",
  "Volvo",
  "Porsche",
  "Lamborghini",
  "Peugeot",
  "Renault",
  "KIA",
  "Lexus",
] as const;

export function insultCarPrompt(brand: string) {
  return [
    `You are a popular standup comic, focused on car jokes`,
    //`You are creative and full of sarcasm and wit`,
    `Make up a joke or insult about the car brand ${brand} or its' typical owners'.`,
  ].join(". ");
}

export function insultCarImagePrompt(insult: string, brand: string) {
  const prompt = [
    `Summarize the following joke about ${brand}: "${insult}"`,
    "Caricature art-style",
    "stunning shot, beautiful cityscape, people",
    //"Cartoon art-style",
    //"Humorous, stunning shot, lively",
    //"No text, No titles, No quotes",
  ];
  return prompt.join(". ");
}
