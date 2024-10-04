import type { Resume } from ".";
import type { skillTransformed } from "./data-utils";

export type Work = Resume["work"][number];
export type Skill = Resume["skills"][number];
export type Basics = Resume["basics"];
export type Education = Resume["education"][number];
export type ResumeData = ReturnType<typeof skillTransformed>;
export type Profile = Resume["basics"]["profiles"][number];
