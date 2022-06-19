import cvData from "../../../cv/resume.json";
import { resumeToString } from "react-cv";

export async function get() {
	const pdfBlob = await resumeToString(cvData);
	return {
		body: pdfBlob,
	};
}
