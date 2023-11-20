import { Text, View } from "@react-pdf/renderer";
import { Icon } from "../icon";

export const SectionHeader = ({
	children = "",
	color = "black",
	iconName,
}: {
	children: string;
	color?: string;
	iconName?: Parameters<typeof Icon>[0]["name"];
}) => {
	return (
		<View style={{}}>
			<Text style={{ fontWeight: "bold", fontSize: 12 }}>
				<Text style={{ color: color, textTransform: "uppercase" }}>
					{children}
					{iconName && (
						<>
							<Text>&nbsp;&nbsp;</Text>
							<Icon name={iconName} style={{ opacity: 0.5 }} />
						</>
					)}
				</Text>
			</Text>
			<View
				style={{
					width: "auto",
					height: 1,
					marginBottom: 10,
				}}
			/>
		</View>
	);
};
