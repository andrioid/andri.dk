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

import Defaultfont from '../../../static/fonts/Montserrat-Regular.otf'

import HeaderFont from '../../../static/fonts/Montserrat-Regular.otf'
import {
	SectionHeader,
	Headline,
	Head,
	ExperienceItem,
	Box,
	colors
} from './elements'

Font.register({
	family: 'HeaderFont',
	src: HeaderFont
})

Font.register({
	family: 'DefaultFont',
	fonts: [
		{ src: require('../../../static/fonts/Montserrat-Regular.otf') },
		{
			src: require('../../../static/fonts/Montserrat-SemiBold.otf'),
			fontWeight: 700
		}
	]
})

// Create styles
const styles = StyleSheet.create({
	page: {
		paddingVertical: 40,
		paddingHorizontal: 40,
		fontSize: 10,
		fontFamily: 'DefaultFont'
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

					<Box title="Frontend skills">
						<Text>React, JavaScript, HTML, CSS, React Native</Text>
					</Box>
					<Box title="Backend skills">
						<Text>Go, PHP, Node.js, MySQL, Postgres</Text>
					</Box>
					<Box title="DevOps skills" borderColor={colors.devops}>
						<Text>Linux, Mac, Windows, Build systems, Cloud Computing</Text>
					</Box>
					<Box title="Languages">
						<Text>Icelandic (native), English (fluent), Danish (fluent)</Text>
					</Box>
					<Box title="Interests">
						<Text>Technology, Photography, Walking, Basketball</Text>
					</Box>

					<Box title="Contact">
						<Text>m@andri.dk</Text>
					</Box>
				</View>
				<View style={styles.right}>
					<Box title="Experience">
						<ExperienceItem
							title="Software Developer"
							period="2019-Present"
							employer="Redia A/S"
							tags={['React', 'Firebase']}
						>
							Did stuff there, very important stuff. Nobody does more important
							stuff than me
						</ExperienceItem>
						<ExperienceItem
							title="Tech Lead"
							period="2010-2012"
							employer="PARKPARK A/S"
						>
							Did stuff there, very important stuff. Nobody does more important
							stuff than me
						</ExperienceItem>
						<ExperienceItem
							title="Software Developer"
							period="2010-2012"
							employer="M1 A/S"
							place="Ålborg"
						>
							Did stuff there, very important stuff. Nobody does more important
							stuff than me
						</ExperienceItem>
						<ExperienceItem
							title="Software Developer"
							period="2010-2012"
							employer="M1 A/S"
							place="Ålborg"
						>
							Did stuff there, very important stuff. Nobody does more important
							stuff than me
						</ExperienceItem>
					</Box>
					<SectionHeader>Experience</SectionHeader>
					<SectionHeader>Education</SectionHeader>
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

const CVFile = () => {
	ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`)
}

const CVPage = () => {
	const [showCV, setShowCV] = useState()
	useEffect(() => {
		setShowCV(true)
	}, [])
	if (!showCV) {
		return null
	}
	return (
		<div style={{ display: 'flex', minHeight: '100vh' }}>
			<CV />
		</div>
	)
}

export default CVPage
