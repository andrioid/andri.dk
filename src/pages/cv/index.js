import React, { useEffect, useState } from 'react'
import ReactPDF, {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	PDFViewer,
	Image,
	Font
} from '@react-pdf/renderer'
import Link from 'gatsby-link'

import andriPic from '../../../static/img/coffee-art.jpg'
import MontserratRegular from '../../../static/fonts/Montserrat-Regular.otf'
import MontserratSemiBold from '../../../static/fonts/Montserrat-SemiBold.otf'
import MontserratItalic from '../../../static/fonts/Montserrat-Italic.otf'

import {
	SectionHeader,
	Headline,
	Head,
	ExperienceItem,
	Box,
	colors,
	TimelineItem,
	Paragraph
} from '../../components/cv/elements'

Font.register({
	family: 'DefaultFont',
	fonts: [
		{ src: MontserratRegular },
		{
			src: MontserratSemiBold,
			fontWeight: 700
		},
		{
			src: MontserratItalic,
			fontStyle: 'italic'
		}
	]
})
// Create styles
const styles = StyleSheet.create({
	page: {
		paddingVertical: 40,
		paddingHorizontal: 40,
		fontSize: 10
		//fontFamily: 'DefaultFont'
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1
	},
	left: {
		flex: 1,
		paddingRight: 20
	},
	right: {
		paddingLeft: 20,
		flex: 2
	}
})
// Create Document Component
const MyDocument = () => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.left}>
					<View style={{ alignItems: 'center', marginBottom: 20 }}>
						<Head src={andriPic} />
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
						<Text>Icelandic (native), English (fluent), Danish (fluent)</Text>
					</Box>

					<Box title="Contact">
						<Text>m@andri.dk</Text>
					</Box>
				</View>
				<View style={styles.right}>
					<Box title="Profile">
						<Text>
							Driven, independent Software Developer with a flair for System
							Administration
						</Text>
					</Box>
					<Box title="Experience">
						<TimelineItem
							title="Software Developer"
							period="2019-Present"
							employer="Redia A/S"
							tags={['React', 'Firebase', 'Firestore', 'TypeScript']}
						>
							Working on a custom platform with CMS features. Running entirely
							on the Firebase platform.
						</TimelineItem>
						<TimelineItem
							title="Tech Lead"
							period="2017-2019"
							employer="PARKPARK A/S"
							tags={[
								'Linux',
								'React',
								'React Native',
								'GCP',
								'MySQL',
								'JavaScript',
								'PHP',
								'DevOps'
							]}
						>
							Pitched and developed our new app on both Android and iOS.
							Migrated our production environment to Google Cloud and our
							development to Docker.
						</TimelineItem>
						<TimelineItem
							title="Senior Developer"
							period="2015-2016"
							employer="UVdata A/S (now KMD)"
							tags={['JavaScript', 'React', 'HTML', 'CSS', 'DevOps']}
						>
							Worked on a green-field project with React and event-sourcing. On
							our learning-platform I introduced React, did release management
							and served as a Scrum master.
						</TimelineItem>
						<TimelineItem
							title="IT Specialist"
							period="2013-2015"
							employer="YouSee A/S"
							tags={['PHP', 'MySQL', 'Linux', 'DevOps']}
						>
							Did stuff there, very important stuff. Nobody does more important
							stuff than me
						</TimelineItem>
						<TimelineItem
							title="Software Developer"
							employer="Lyngsø Systems A/S"
							period="2013 - 2013"
						/>
						<TimelineItem
							title="Software Developer"
							employer="M1 A/S"
							period="2012 - 2013"
						/>
						<TimelineItem
							title="Intern (Developer)"
							employer="Sprettur ehf"
							period="2012 - 2012"
						/>
						<Text style={{ fontStyle: 'italic', fontSize: 8 }}>
							Been working in IT since 1999. Full list available on LinkedIn.
						</Text>
					</Box>
					<Box title="Education">
						<TimelineItem
							title="BSc, Computer Engineering"
							period="2007-2012"
							employer="Aalborg University"
						/>
						<TimelineItem
							title="Agile Design & Test Driven Development"
							period="2012"
							employer="Sprettur ehf"
						/>
						<TimelineItem
							title="Engineering Entrance Course"
							period="2006-2007"
							employer="Aalborg University"
						/>
					</Box>
					<Box title="About">
						<Paragraph>
							I come from Reykjavík, Iceland and am the oldest of 5 brothers. In
							2006 I moved to Denmark to study. I now live near Aalborg, Denmark
							with my girlfriend and son. In my off-time I like to cook, take
							photos and go for walks.
						</Paragraph>
						<Paragraph>
							I've been facinated by computers since age 8 and spend every
							waking minute learing some thing new about them.
						</Paragraph>
					</Box>
				</View>
			</View>
		</Page>
	</Document>
)

const CV = () => (
	<PDFViewer style={{ flex: 1 }}>
		<MyDocument />
	</PDFViewer>
)

const CVPage = () => {
	const [viewMode, setViewMode] = useState()
	useEffect(() => {
		setViewMode('web')
	}, [])
	if (!viewMode) {
		return <p>moo</p>
	}
	return (
		<div style={{ display: 'flex', minHeight: '100vh' }}>
			<CV />
		</div>
	)
}

export default CVPage
