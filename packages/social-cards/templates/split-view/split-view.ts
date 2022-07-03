import { GenerateOptions } from "../../types";

export function SplitView(
	props: Readonly<{
		title: string;
		tags?: string[];
		description?: string;
		coverImage?: string;
	}>
): GenerateOptions {
	return {
		svg: "bleh",
		hash: "moo",
	} as GenerateOptions;
}
