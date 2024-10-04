import { Text } from "@react-pdf/renderer";
import { Skill } from "../types";

export function SkillKeywords({ skill }: { skill: Skill }) {
  let out: JSX.Element[] = [];
  if (!skill || !skill.keywords) {
    return <>{out.map((C) => C)}</>;
  }

  skill.keywords.forEach((kw, idx) => {
    if (skill.preferred?.includes(kw)) {
      out.push(
        <Text
          key={kw}
          style={{
            textDecoration: "underline",
          }}
        >
          {kw}
        </Text>,
      );
    } else {
      out.push(<Text key={kw}>{kw}</Text>);
    }
    if (skill.keywords && idx < skill.keywords.length - 1) {
      out.push(<Text key={`${kw}-comma`}>, </Text>);
    }
  });
  return <>{out.map((C) => C)}</>;
}
