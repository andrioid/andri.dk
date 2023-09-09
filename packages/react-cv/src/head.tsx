import { Image } from "@react-pdf/renderer";
import path from "node:path";
import { ASSET_PATH } from "src";

export const Head = ({ src }: { src: any }) => {
	const relPath = path.resolve(ASSET_PATH, src);
	return (
		<Image
			source={relPath}
			style={{
				width: 90,
				height: 90,
				borderRadius: 90,
				marginBottom: 10,
				borderColor: "#f3f3f3",
				borderWidth: 1,
			}}
		/>
	);
};
