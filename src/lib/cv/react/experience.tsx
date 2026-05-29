import { Skill, Work } from "../types";
import { Section } from "./section";
import { WorkItem } from "./work-item";

export function Experience({
  work = [],
  skills,
}: {
  work?: Work[];
  skills?: Skill[];
}) {
  const fullWork = work.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
  return (
    <Section wrap={true} title="Experience" iconName="work">
      {fullWork?.map((w, idx) => (
        <WorkItem
          item={w}
          idx={idx}
          key={`${w.company + w.startDate}`}
          skills={skills}
          short={shouldCollapse(w)}
        />
      ))}
    </Section>
  );
}

function shouldCollapse(w: Work): boolean {
  const now = new Date();
  const start = new Date(w.startDate);
  const end = w.endDate ? new Date(w.endDate) : new Date();
  const numberOfMonthsAtJob =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const numberOfYearsSince =
    (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24 * 365);

  // Keep recent (except short stints)
  if (numberOfYearsSince < 10 && numberOfMonthsAtJob >= 12) {
    return false;
  }

  // Still show jobs I've held for over 2 years
  if (numberOfMonthsAtJob >= 24) {
    return false;
  }

  return true;
}
