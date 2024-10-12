export const DEFAULT_FONT = "Montserrat";

import resume from "./resume.json";
import { skillTransformed } from "./data-utils";
export type Resume = typeof resume;
export const resumeRaw = resume;
export const resumeProcessed = skillTransformed(resume.skills, resume.work);
