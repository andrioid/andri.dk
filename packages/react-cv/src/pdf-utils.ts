import { Font } from "@react-pdf/renderer";

import path from "path";
import { DEFAULT_FONT } from "src";

export function registerFonts(assetPath: string) {
	Font.registerHyphenationCallback((word) => [word]);
	Font.register({
		family: DEFAULT_FONT,
		fonts: [
			{
				src: path.resolve(assetPath, "fonts/Montserrat-Regular.ttf"),
			},
			{
				src: path.resolve(assetPath, "fonts/Montserrat-SemiBold.ttf"),
				fontWeight: 700,
			},
			{
				src: path.resolve(assetPath, "fonts/Montserrat-Light.ttf"),
				fontWeight: 300,
			},
			{
				src: path.resolve(assetPath, "fonts/Montserrat-Italic.ttf"),
				fontStyle: "italic",
			},
		],
	});

	Font.register({
		family: "Brands",
		fonts: [
			{
				src: path.resolve(assetPath, "fonts/brands.ttf"),
			},
		],
	});
	Font.register({
		family: "Awesome",
		fonts: [
			{
				src: path.resolve(assetPath, "fonts/awesome-solid.ttf"),
			},
		],
	});
}
