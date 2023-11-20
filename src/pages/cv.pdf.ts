// Note: Does not work with Deno SSR yet
import cvData from "../../packages/cv/resume.json";
import { resumeToString } from "react-cv";
export const prerender = true;

export async function GET() {
	const pdfBlob = await resumeToString(cvData);
	return new Response(pdfBlob);
}
