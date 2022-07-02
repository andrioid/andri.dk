import { Text } from "@react-pdf/renderer";
import React from "react";
import { Skill, Work } from "../resume-types";
import { Section } from "../section/section";
import { WorkItem } from "./work-item";

export function Experience({
  work,
  skills,
  fullYears = 8,
}: {
  work?: Work[];
  skills?: Skill[];
  fullYears?: number;
}) {
  const latestWork = work?.filter((w) => filterLatest(w, false, fullYears));
  const olderWork = work?.filter((w) => filterLatest(w, true, fullYears));

  return (
    <Section wrap={true} title="Experience" iconName="work">
      {latestWork?.slice(0, 100).map((w, idx) => (
        <WorkItem
          item={w}
          idx={idx}
          key={`${w.company + w.startDate}`}
          skills={skills}
        />
      ))}
      {olderWork?.map((w) => {
        return <WorkItem item={w} key={`${w.company + w.startDate}`} short />;
      })}
    </Section>
  );
}

function filterLatest(w: Work, reverse = false, years: number = 5) {
  if (!w.endDate) {
    return reverse ? false : true;
  }
  const date = new Date(w.endDate);
  if (
    date.getTime() >
    new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * years
  ) {
    return reverse ? false : true;
  }
  return reverse ? true : false;
}
