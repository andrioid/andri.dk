// Note: Does not work with Deno SSR yet
import { resumeToString } from "react-cv";
import cvData from "../../packages/cv/resume.json";
export const prerender = true;

export async function GET() {
	const pdfBlob = await resumeToString(cvData);
	return new Response(pdfBlob);
}
