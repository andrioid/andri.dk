import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors } from "../theme";
import { DEFAULT_FONT } from "src";

export function Footer({ name, email }: { name: string; email: string }) {
	return (
		<View
			fixed
			style={styles.footer}
			render={(page) => (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text style={styles.footerText}>{name}</Text>

					<Text style={styles.footerText}>{email}</Text>
					<Text
						style={styles.footerText}
					>{`${page.pageNumber} / ${page.totalPages}`}</Text>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	footer: {
		fontFamily: DEFAULT_FONT,
		fontSize: 8,
		//marginHorizontal: 10,
		borderTopColor: colors?.["grayBackground"] || "grey",
		borderTopWidth: 1,
		paddingVertical: 10,
		marginHorizontal: 10,
		width: "100%",
		position: "absolute",
		bottom: 20,
		left: 20,
	},
	footerText: {
		fontSize: 8,
	},
});
