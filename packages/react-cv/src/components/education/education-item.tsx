import { Text, View } from "@react-pdf/renderer";
import { Education } from "../resume-types";
import { periodToString } from "../utils";

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
