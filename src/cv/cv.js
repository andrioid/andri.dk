import React, { useEffect, useState } from 'react'
import ReactPDF, {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	PDFViewer,
	Image,
	Font,
	Link
} from '@react-pdf/renderer'

import {
	SectionHeader,
	Headline,
	Head,
	ExperienceItem,
	Box,
	colors,
	TimelineItem,
	Paragraph,
	EducationItem,
	periodToString
} from './elements'

import resolveConfig from 'tailwindcss/resolveConfig'

import localConfig from '../../tailwind.config'

const { theme } = resolveConfig(localConfig)

import resume from './resume.json'

import { Andri } from './pictures'

// Create styles
const styles = StyleSheet.create({
	page: {
		paddingVertical: 30,
		paddingHorizontal: 30,
		fontSize: 9,
		color: theme.colors.gray[900],
		fontFamily: 'DefaultFont'
	},
	leftHeader: {
		alignItems: 'center',
		paddingBottom: 20
	},
	left: {
		width: '30vw',
		marginRight: 20
	},
	right: {
		marginLeft: 20,
		flex: 1
	}
})

const CVFrontpage = ({ image }) => (
	<Page size="A4" style={styles.page}>
		<View style={{ flexDirection: 'row' }}>
			<View style={styles.left}>
				<View wrap={false} style={styles.leftHeader}>
					<Head src={Andri} />
					<Headline>Andri Óskarsson</Headline>
					<Text style={{ fontSize: 12 }}>Computer Engineer</Text>
				</View>
				<Box title="Current Status">Not Seeking Employment</Box>

				<Box title="Programming" color={colors.programming}>
					<Text>
						Frontend, Backend, Mobile, System Design, Message Queues, Git,
						Subversion
					</Text>
				</Box>

				<Box title="Operations" color={colors.operations}>
					<Text>
						Cloud Computing, Firebase, Linux, Monitoring, Backups, CI, CD,
						Deployment, Docker
					</Text>
				</Box>

				<Box title="Databases" color={colors.databases}>
					<Text>MySQL, Postgres, MongoDB, Firestore, Redis, SQLite</Text>
				</Box>

				<Box title="Languages">
					<Text>Icelandic (native)</Text>
					<Text>English (fluent)</Text>
					<Text>Danish (fluent)</Text>
				</Box>

				<Box title="Social">
					<Text>Co-organizer Aalborg React Meetup</Text>
					<Text>Co-organizer Aalborg Hackathon</Text>
				</Box>

				<Box title="Contact">
					<Link src="mailto:m@andri.dk">
						<Text>m@andri.dk</Text>
					</Link>
				</Box>
			</View>
			<View style={styles.right}>
				<View
					style={{
						marginBottom: 10,
						backgroundColor: theme.colors.gray[100],
						padding: 4
					}}
				>
					<SectionHeader>Profile</SectionHeader>
					<Text>{resume.basics.summary}</Text>
				</View>
				<View>
					<SectionHeader>Experience</SectionHeader>
					{resume.work.slice(0, 100).map(w => (
						<TimelineItem
							key={`${w.company + w.startDate}`}
							title={w.position}
							employer={w.company}
							period={periodToString(w.startDate, w.endDate)}
							tags={w.skills}
						>
							{w.summary}
						</TimelineItem>
					))}
				</View>

				<View>
					<SectionHeader>Education</SectionHeader>
					{resume.education.map(e => (
						<EducationItem
							key={`${e.institution + e.startDate}`}
							institution={e.institution}
							area={e.area}
							studyType={e.studyType}
							startDate={e.startDate}
							endDate={e.endDate}
						/>
					))}
				</View>

				<Box title="About">
					<Paragraph>
						I come from Reykjavík, Iceland and am the oldest of 5 brothers. In
						2006 I moved to Denmark to study. I now live near Aalborg, Denmark
						with my girlfriend and son. In my off-time I like to cook, take
						photos and go for walks.
					</Paragraph>
					<Paragraph>
						I've been facinated by computers since age 8 and spend much of my
						free time, learning more about them.
					</Paragraph>
				</Box>
			</View>
		</View>
	</Page>
)

// Create Document Component
export const CVDoc = ({ image }) => (
	<Document>
		<CVFrontpage image={image} />
	</Document>
)
