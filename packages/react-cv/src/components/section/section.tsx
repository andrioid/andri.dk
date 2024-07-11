import { View } from "@react-pdf/renderer";
import { ReactNode } from "react";
import { Icon } from "../icon";
import { SectionHeader } from "./section-header";

// Not meant for anything wrapping pages
export const Section = ({
	children,
	title,
	color,
	iconName,
	style = {},
	wrap = false,
}: {
	wrap?: boolean;
	children: ReactNode;
	title: string;
	color?: string;
	style?: any;
	iconName?: Parameters<typeof Icon>[0]["name"];
}) => {
	if (!children || !title) {
		throw new Error("children and title required");
	}
	return (
		<View wrap={wrap} style={{ marginBottom: 10, padding: 10, ...style }}>
			<SectionHeader color={color} iconName={iconName}>
				{title}
			</SectionHeader>
			<View>{children}</View>
		</View>
	);
};
