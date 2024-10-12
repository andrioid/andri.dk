import type { Resume } from "..";
import { CVDocument } from "./cv-document";

export function CVWrapper({ resume }: { resume: Resume }) {
  return (
    <CVDocument
      skills={resume.skills}
      basics={resume.basics}
      work={resume.work}
      education={resume.education}
    />
  );
}
