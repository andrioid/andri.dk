import { Document } from "@react-pdf/renderer";
import { type LetterFrontmatter, Markdown } from "./markdown";

export const ApplicationDoc = ({
	frontmatter,
	markdown,
}: {
	frontmatter: LetterFrontmatter;
	markdown: string;
}) => (
	<Document>
		<Markdown frontmatter={frontmatter}>{markdown}</Markdown>
	</Document>
);
