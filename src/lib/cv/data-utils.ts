import type { Skill, Work } from "./types";

function durationForWork(w: Work) {
  const start = w.startDate ? new Date(w.startDate) : undefined;
  if (start === undefined) return 0;
  const end = w.endDate ? new Date(w.endDate) : new Date();
  const diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 365;
  return Math.floor(diff);
}

function durationForSkill(work: Array<Work>, skill: string) {
  let sum = 0;
  for (const w of work) {
    if (!w.startDate) {
      continue; // skip if no start date
    }
    const dur = durationForWork(w);
    if (w.keywords && w.keywords.indexOf(skill) !== -1) {
      sum += dur;
    }
  }
  return sum;
}

// Months of experience
export function durationForKeyword(work: Work[], skill: string): number {
  let sum = 0;
  for (const w of work) {
    const dur = durationForWork(w);
    if (w.keywords && w.keywords.indexOf(skill) !== -1) {
      sum += dur;
    }
  }
  return Math.ceil(sum);
}

export function skillTransformed(
  rootSkills: Array<Skill>,
  workSkills: Array<Work>,
) {
  const skills = rootSkills.map((c) => {
    if (!c.keywords || !workSkills) {
      return {
        ...c,
        keywords: [],
      };
    }
    const nk = c.keywords
      .map((k) => {
        const score = durationForSkill(workSkills, k) || 0;
        return {
          name: k,
          // score is currently just duration
          score,
        };
      })
      .filter((k) => {
        if (k.score >= 0.5) return true;
        if (c.id === "processes") return true;
        return false;
      }) // minimum a year
      .sort((a, b) => {
        return b.score - a.score;
      });
    return {
      ...c,
      keywords: nk,
    };
  });
  return skills;
}

export const periodToString = (
  start: string | undefined,
  end: string | undefined,
  locale = "en-DA",
): string => {
  if (!start) {
    throw new Error("no startDate");
  }

  const startDate = new Date(start);
  const endDate = (end && new Date(end)) || new Date();

  const dateStringOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
  };

  const polishedStart = startDate.toLocaleDateString(locale, dateStringOptions);
  const polishedEnd = endDate.toLocaleDateString(locale, dateStringOptions);

  if (endDate === startDate) {
    return `${polishedStart}`;
  }

  if (!end) {
    return `${polishedStart} - Present`;
  }

  return `${polishedStart} - ${polishedEnd}`;
};
