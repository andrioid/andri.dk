import { Resume, Skill } from "./components/resume-types";
import { durationForKeyword } from "./components/utils";
import fs from "fs-extra";
import path from "path";
import { useMemo } from "react";
import { colors, getColor } from "./theme";
// Returns a parsed resume, ready for our CV document

const CV_PATH = path.join("static/resume.json");

function skillToColor(skillProp: string, skills: Skill[]): string | undefined {
  if (!skillProp) {
    return;
  }

  let m = skillProp;
  if (Array.isArray(skillProp)) {
    m = skillProp[0];
  }

  if (skills && typeof m === "string") {
    const idx = skills.findIndex((skill: Skill) => {
      const match = skill?.keywords?.findIndex(
        (k) => k.toLowerCase() === m.toLowerCase()
      );
      if (match && match > -1) {
        return true;
      }
      return false;
    });

    if (skills[idx]?.id && getColor(skills[idx].id!)) {
      return getColor(skills[idx].id!);
    }
  }
  return;
}

export function useResume() {
  // Just read the file once
  const exported = useMemo(() => {
    try {
      const resumeStr = fs.readFileSync(CV_PATH).toString();
      const resume = JSON.parse(resumeStr) as Resume;
      const { work, education, basics, skills } = resume;

      const skillsWithSortedKeywords = resume.skills?.map((c) => {
        const durations: Record<string, number> = {};
        c.keywords?.forEach((kw, idx) => {
          if (!resume.work) {
            return;
          }
          durations[kw] = durationForKeyword(resume.work, kw);
        });
        const nk = c.keywords?.sort((a, b) => {
          return durations[b] - durations[a];
        });
        return { ...c, keywords: nk };
      });

      const sortedWork = work?.map((w) => {
        if (!w.keywords) {
          return w;
        }
        const kw = [...w.keywords].sort((a, b) => {
          return a.localeCompare(b);
        });
        return {
          ...w,
          keywords: kw,
        };
      });

      return {
        skills: skillsWithSortedKeywords,
        basics,
        work: sortedWork,
        education,
        skillToColor: (skill: string) =>
          (skillsWithSortedKeywords &&
            skillToColor(skill, skillsWithSortedKeywords)) ||
          undefined,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Unable to parse resume");
    }
  }, []);

  return exported;
}
