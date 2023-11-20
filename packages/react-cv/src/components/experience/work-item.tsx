import { Link, Text, View } from "@react-pdf/renderer";
import { Work, Skill } from "../resume-types";
import { Tag } from "../tag";
import { periodToString } from "../utils";
import { colors } from "../../theme";

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

							if (skills[idx]?.id && colors[skills[idx].id!]) {
								color = colors[skills[idx].id!];
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
