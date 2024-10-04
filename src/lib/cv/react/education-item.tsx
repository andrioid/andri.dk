import { Text, View } from "@react-pdf/renderer";
import { periodToString } from "../data-utils";
import { Education } from "../types";

export const EducationItem = ({ item }: { item: Education }) => (
  <View wrap={false}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        {item.area}, {item.studyType}
      </Text>
      <Text style={{ color: "grey" }}>
        {periodToString(item.startDate, item.endDate)}
      </Text>
    </View>
    <Text style={{ fontWeight: "normal" }}>{item.institution}</Text>
  </View>
);
