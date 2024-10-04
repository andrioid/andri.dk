import { renderToStream } from "@react-pdf/renderer";

export const DEFAULT_FONT = "Montserrat";

import resume from "./resume.json";
import { CVWrapper } from "./react/cv-wrapper";
import { skillTransformed } from "./data-utils";
import { colors } from "./colors";
export type Resume = typeof resume;
export const resumeRaw = resume;
export const resumeProcessed = skillTransformed(resume.skills, resume.work);
