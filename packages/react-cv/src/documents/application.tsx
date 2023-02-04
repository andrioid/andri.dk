import { Document } from "@react-pdf/renderer";
import { Markdown } from "../components/markdown";

// Create Document Component
export const ApplicationDoc = ({
	frontmatter,
	markdown,
}: {
	frontmatter: Record<string, any>;
	markdown: string;
}) => (
	<Document>
		<Markdown frontmatter={frontmatter}>{markdown}</Markdown>
	</Document>
);
