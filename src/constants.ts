export const site = {
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:3000"
			: "https://andri.dk",
	title: "Andri Óskarsson | andri.dk",
	description:
		"I make websites, create apps, manage infrastructure, develop products and more.",
	author: "Andri Óskarsson",
};
