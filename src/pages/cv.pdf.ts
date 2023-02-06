// Note: Does not work with Deno SSR yet
import cvData from "../../packages/cv/resume.json";
import { resumeToString } from "react-cv";
export const prerender = true;

export async function get() {
	const pdfBlob = await resumeToString(cvData);
	return {
		body: pdfBlob,
	};
}
