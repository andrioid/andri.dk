import * as ReactPDF from "@react-pdf/renderer";
import { Paragraph } from "../components/paragraph";
import { Section } from "../components/section/section";
import { Head } from "../head";

import { DEFAULT_FONT } from "src";
import { Basic, Education, Skill, Work } from "src/components/resume-types";
import { EducationItem } from "../components/education/education-item";
import { Experience } from "../components/experience/experience";
import { Footer } from "../components/footer";
import { Icon } from "../components/icon";
import { Profiles } from "../components/profiles";
import { SkillKeywords } from "../components/skills/skills-keywords";
import { colors } from "../theme";

const { Link, Page, StyleSheet, Text, Document, View } = ReactPDF;

export const CVDocument = ({
	basics,
	education,
	work,
	skills,
}: {
	basics: Basic;
	education: Education[];
	work: Work[];
	skills: Skill[];
	// TODO: fix types, create a wrapper component
}) => {
	const idxFirstSpace = basics.name.indexOf(" ");
	const firstName = basics.name.substr(0, idxFirstSpace + 1);
	const lastName = basics.name.substr(idxFirstSpace + 1, basics.name.length);

	return (
		<Document author={basics.name} subject={`${basics.name} CV`}>
			<Page size="A4" style={styles.page}>
				<View style={styles.top}>
					<View>
						<Text style={styles.textName}>
							<Text style={styles.firstName}>{firstName}</Text>
							<Text style={styles.lastName}>{lastName}</Text>
						</Text>
						<Text style={styles.textTitle}>{basics.label}</Text>
						<Text style={styles.location}>
							<Icon name="home" />
							&nbsp;&nbsp;Aalborg, Denmark
						</Text>
					</View>
					<Head src="andri.jpg"></Head>
				</View>

				<View
					style={{
						flexDirection: "row",
					}}
				>
					<View style={styles.left}>
						<Section title="Education" iconName="education">
							{education?.map((e) => (
								<EducationItem
									item={e}
									key={`${e.institution + e.startDate}`}
								/>
							))}
						</Section>
						{basics.summary && (
							<Section title="About" iconName="about">
								<Paragraph style={{ marginTop: 0 }}>
									{basics.summary}
								</Paragraph>
							</Section>
						)}
						<Section title="Skills" iconName="skills">
							<Text
								style={{
									color: "grey",
									fontSize: 7,
									marginTop: -10,
								}}
							>
								Ordered by experience. Underline for preference.
							</Text>
							{skills?.map((s) => (
								<View
									key={s.name}
									wrap={true}
									style={{ marginTop: 10 }}
								>
									<Text
										style={{
											fontWeight: "bold",
											color:
												s.id !== undefined
													? colors[
															s.id as keyof typeof colors
														]
													: "black",
										}}
										key={s.name}
									>
										{s.name}
									</Text>
									<View
										style={{
											flexWrap: "wrap",
											flexDirection: "row",
											marginTop: 5,
										}}
									>
										<SkillKeywords skill={s} />
									</View>
								</View>
							))}
						</Section>
						<Section title="Languages" iconName="language">
							<Text>Icelandic (native)</Text>
							<Text>English (fluent)</Text>
							<Text>Danish (fluent)</Text>
						</Section>
						<Section
							title="Networking"
							style={{
								backgroundColor: colors["grayBackground"],
							}}
						>
							<Text>
								Speaker & Co-Organizer{" "}
								<Link src="https://meetup.com">
									Aalborg React Meetup
								</Link>
							</Text>
						</Section>
						<Profiles profiles={basics.profiles!}></Profiles>
					</View>
					<View style={styles.right}>
						<Experience work={work} skills={skills} />
					</View>
				</View>

				<Section title="References">
					<Text style={{ fontStyle: "italic" }}>
						Available on request...
					</Text>
				</Section>

				<Footer email={basics.email!} name={"CV"} />
			</Page>
		</Document>
	);
};

// Create styles
const styles = StyleSheet.create({
	page: {
		//paddingVertical: 30,
		position: "relative",
		paddingTop: 20,
		paddingBottom: 60,
		paddingHorizontal: 30,
		//marginHorizontal: 30,
		fontSize: 8,
		color: "black",
		fontFamily: DEFAULT_FONT,
	},
	leftHeader: {
		//alignItems: "center",
		paddingBottom: 20,
	},
	top: {
		flexDirection: "row",
		//alignItems: "center",
		paddingBottom: 20,
		paddingTop: 20,
		paddingLeft: 10,
		justifyContent: "space-between",
	},
	topSummary: {
		marginTop: 20,
		paddingVertical: 10,
		borderRadius: 2.5,
	},
	topSummaryText: {
		fontSize: 11,
		fontWeight: "semibold",
		//color: "white",
	},
	left: {
		//width: "50%",
		//marginTop: 20,
		paddingRight: 10,
		backgroundColor: colors.grayBackground,
		borderRadius: 2.5,
		flex: 1.4,
	},
	right: {
		//marginTop: 20,
		paddingLeft: 10,
		//width: "50%",
		flex: 2,
	},
	textName: { fontSize: 30, fontWeight: 500 },
	firstName: {},
	lastName: {},
	textTitle: {
		marginTop: 0,
		fontSize: 12,
		color: colors.personLabel,
	},
	location: {
		marginTop: 5,
	},
});
