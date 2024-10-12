import { Link, Text, View } from "@react-pdf/renderer";
import { periodToString } from "../data-utils";
import { Skill, Work } from "../types";
import { colors } from "../colors";
import { Tag } from "./tag";

export const WorkItem = ({
  item,
  short = false,
  skills,
}: {
  item: Work;
  idx?: number;
  skills?: Skill[];
  short?: boolean;
}) => {
  //tags = tags.sort();
  const period = periodToString(item.startDate, item.endDate);
  return (
    <View
      wrap={false}
      style={{
        marginBottom: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
          flexWrap: "wrap",
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{item.position}</Text>
          <Text>
            {item.url ? (
              <Link src={item.url}>{item.company}</Link>
            ) : (
              item.company
            )}
          </Text>
        </View>
        <Text style={{ color: "grey", fontSize: 8 }}>{period}</Text>
      </View>
      {!short && item.summary && (
        <Text style={{ marginBottom: 5 }}>{item.summary}</Text>
      )}
      {!short && item.keywords && (
        <View
          wrap
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 5,
          }}
        >
          {item.keywords?.map((m) => {
            let color = "black"; // default
            if (skills) {
              const idx = skills.findIndex((skill: Skill) => {
                const match = skill?.keywords?.findIndex(
                  (k) => k.toLowerCase() === m.toLowerCase(),
                );
                if (match && match > -1) {
                  return true;
                }
                return false;
              });
              const skill = skills[idx];

              if (skill?.id && colors[skill.id as keyof typeof colors]) {
                color = colors[skill.id as keyof typeof colors];
              }
            }
            return (
              <Tag key={m} color={color}>
                {m}
              </Tag>
            );
          })}
        </View>
      )}
    </View>
  );
};
