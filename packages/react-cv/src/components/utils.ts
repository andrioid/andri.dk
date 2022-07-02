import { Skill, Work, WorkWithKeywords } from "./resume-types";

export const periodToString = (
  start: string | undefined,
  end: string | undefined,
  locale = "en-DA"
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

export function durationForWork(work: Work): number {
  const start = work.startDate && new Date(work.startDate);
  if (!start) {
    throw new Error("no start date for work item: " + JSON.stringify(work));
  }
  const end = (work.endDate && new Date(work.endDate)) || new Date();

  const years = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 365;
  return years;
}

// Months of experience
export function durationForKeyword(
  work: WorkWithKeywords[],
  skill: string
): number {
  let sum = 0;
  for (const w of work) {
    const dur = durationForWork(w);
    if (w.keywords && w.keywords.indexOf(skill) !== -1) {
      sum += dur;
    }
  }
  return Math.ceil(sum);
}
