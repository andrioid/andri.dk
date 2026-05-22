import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import ReactMarkdown from "markdown-to-jsx";
import React from "react";
import { DEFAULT_FONT } from "..";
import { Footer } from "./footer";

const TextOverride = {
	component: Text,
};

const typography: Record<string, Style> = {
	h1: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
	},
	h2: {
		fontSize: 16,
		marginBottom: 10,
	},
	h3: {
		fontSize: 14,
		marginBottom: 10,
	},
	h4: {
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 10,
	},
	p: {
		marginBottom: 10,
	},
	emph: {
		fontStyle: "italic",
	},
	strong: {
		fontWeight: "bold",
	},
};

export function Typography({
	children,
	el,
}: {
	children: string;
	el: keyof typeof typography;
}) {
	return <Text style={[typography[el]]}>{children}</Text>;
}

function Spacing() {
	return <View style={{ marginTop: 5 }} />;
}

export type LetterFrontmatter = {
	date: Date | string;
	location: string;
	title?: string;
	name?: string;
	email?: string;
};

function Cover({ frontmatter }: { frontmatter: LetterFrontmatter }) {
	const date =
		frontmatter.date instanceof Date
			? frontmatter.date
			: new Date(frontmatter.date);

	return (
		<View style={styles.cover}>
			<Text>{date.toLocaleDateString()}</Text>
			<Text>{frontmatter.location}</Text>
		</View>
	);
}

export function Markdown({
	children,
	frontmatter,
}: {
	children: string;
	frontmatter: LetterFrontmatter;
}) {
	if (typeof children !== "string" || !children) {
		throw new Error("Markdown expects a non-empty string body");
	}
	if (!frontmatter?.date || !frontmatter?.location) {
		throw new Error("Frontmatter 'date' and 'location' are required");
	}

	const signOffName = frontmatter.name ?? "Andri Óskarsson";
	const footerTitle = frontmatter.title ?? "Application";
	const footerEmail = frontmatter.email ?? "hello@andri.dk";

	const options = {
		disableParsingRawHTML: true,
		createElement: React.createElement,
		overrides: {
			a: Link,
			text: Text,
			div: View,
			h1: { component: Typography, props: { el: "h1" } },
			h2: { component: Typography, props: { el: "h2" } },
			h3: { component: Typography, props: { el: "h3" } },
			h4: { component: Typography, props: { el: "h4" } },
			p: { component: Typography, props: { el: "p" } },
			li: TextOverride,
			span: TextOverride,
			br: Spacing,
			em: { component: Typography, props: { el: "emph" } },
			strong: { component: Typography, props: { el: "strong" } },
			outer: View,
		},
	};

	return (
		<Page style={styles.page}>
			<Cover frontmatter={frontmatter} />
			<ReactMarkdown options={options}>{children}</ReactMarkdown>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "flex-end",
					alignItems: "flex-end",
				}}
			>
				<View
					style={{
						width: 180,
						borderTop: 1,
						paddingTop: 10,
						alignItems: "flex-end",
					}}
				>
					<Text>{signOffName}</Text>
				</View>
			</View>
			<Footer name={footerTitle} email={footerEmail} />
		</Page>
	);
}

const styles = StyleSheet.create({
	page: {
		position: "relative",
		paddingTop: 40,
		paddingBottom: 60,
		paddingHorizontal: 30,
		fontSize: 12,
		color: "black",
		fontFamily: DEFAULT_FONT,
	},
	cover: {
		alignItems: "flex-end",
		marginBottom: 40,
	},
});
