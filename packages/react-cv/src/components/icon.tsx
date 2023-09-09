import { Text } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

// Font Awesome 5
// https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-5x/

// brand regular
const BRAND_ICONS = {
	twitter: "\uf099",
	github: "\uf09b",
	linkedin: "\uf0e1",
};

const ICONS = {
	home: "\uf015",
	europe: "\uf57e",
	language: "\uf1ab",
	education: "\uf19d",
	work: "\uf0b1",
	person: "\uf4fb",
	skills: "\uf6e3",
	about: "\uf05a",
};

export function Icon({
	name,
	style = {},
}: {
	style?: Style;
	name: keyof typeof ICONS | keyof typeof BRAND_ICONS;
}) {
	if (BRAND_ICONS[name as keyof typeof BRAND_ICONS]) {
		return (
			<Text style={[{ fontFamily: "Brands" }, style]}>
				{BRAND_ICONS[name as keyof typeof BRAND_ICONS]}
			</Text>
		);
	}
	if (ICONS[name as keyof typeof ICONS]) {
		return (
			<Text style={[{ fontFamily: "Awesome" }, style]}>
				{ICONS[name as keyof typeof ICONS]}
			</Text>
		);
	}
	throw new Error("Unsupported Icon name");
}
