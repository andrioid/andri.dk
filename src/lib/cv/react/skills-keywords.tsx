import { Text } from "@react-pdf/renderer";
import { Skill } from "../types";
import { JSX } from "astro/jsx-runtime";

export function SkillKeywords({ skill }: { skill: Skill }) {
	let out: JSX.Element[] = [];
	if (!skill || !skill.keywords) {
		return <>{out.map((C) => C)}</>;
	}

	// The separator is part of the keyword's own Text node, never a sibling.
	// As a sibling it is an inline box in its own right, so a line can break
	// before it and leave a comma stranded at the start of the next line.
	skill.keywords.forEach((kw, idx) => {
		const isLast = idx === (skill.keywords?.length ?? 0) - 1;
		const isPreferred = skill.preferred?.includes(kw);

		out.push(
			<Text key={kw}>
				{isPreferred ? (
					<Text style={{ textDecoration: "underline" }}>{kw}</Text>
				) : (
					kw
				)}
				{isLast ? "" : ", "}
			</Text>,
		);
	});
	return <>{out.map((C) => C)}</>;
}
