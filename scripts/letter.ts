import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import matter from "gray-matter";
import { renderToBuffer } from "@react-pdf/renderer";
import { ApplicationDoc } from "../src/lib/cv/react/application-document";
import type { LetterFrontmatter } from "../src/lib/cv/react/markdown";
import { registerFonts } from "../src/lib/cv/pdf-utils";

async function main() {
	const input = process.argv[2];
	if (!input) {
		console.error("Usage: npm run letter -- <path-to-markdown>");
		process.exit(1);
	}

	const absInput = path.resolve(process.cwd(), input);
	if (!fs.existsSync(absInput)) {
		console.error(`File not found: ${absInput}`);
		process.exit(1);
	}

	const raw = fs.readFileSync(absInput, "utf8");
	const parsed = matter(raw);
	const frontmatter = parsed.data as Partial<LetterFrontmatter>;

	if (!frontmatter.date || !frontmatter.location) {
		console.error(
			"Frontmatter must include 'date' and 'location'. Got:",
			frontmatter,
		);
		process.exit(1);
	}

	registerFonts();

	const doc = createElement(ApplicationDoc, {
		frontmatter: frontmatter as LetterFrontmatter,
		markdown: parsed.content.trim(),
	});

	const buffer = await renderToBuffer(doc as never);

	const output = path.join(
		path.dirname(absInput),
		`${path.basename(absInput, path.extname(absInput))}.pdf`,
	);
	fs.writeFileSync(output, buffer);
	console.log(`Wrote ${path.relative(process.cwd(), output)}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
