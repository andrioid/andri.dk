import { renderToFile, renderToString } from "@react-pdf/renderer";
import React from "react";
import { Resume } from "./components/resume-types";
import { CVWrapper } from "./documents/cv-wrapper";

export async function resumeToString(resume: Resume) {
	const cvDoc = React.createElement(CVWrapper, { resume: resume });
	return renderToString(cvDoc as any);
}
