import React from 'react'

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

import { hex } from 'wcag-contrast'
import dayjs from 'dayjs'
import 'dayjs/locale/en'

export const colors = {
	borders: '#d3d3d3',
	operations: '#259490',
	programming: '#2460A7',
	databases: '#491D70'
}

export const tagColors = {
	react: colors.programming,
	linux: colors.operations,
	gcp: colors.operations,
	mysql: colors.databases,
	firestore: colors.databases,
	php: colors.programming,
	typescript: colors.programming,
	javascript: colors.programming
}

export const Head = ({ src }) => (
	<Image
		source={src}
		resizeMode="contain"
		style={{
			width: 100,
			height: 100,
			borderRadius: 50,
			marginBottom: 10,
			borderColor: colors.borders,
			borderWidth: 1
		}}
	/>
)

export const SectionHeader = ({ children, color = 'black' }) => {
	const first = children.toUpperCase()
	const last = children.substring(1)
	return (
		<>
			<Text style={{ fontWeight: 'bold' }}>
				<Text style={{ color: color }}>{first}</Text>
			</Text>
			<View
				style={{
					width: 'auto',
					height: 1,
					borderBottomColor: colors.borders,
					borderBottomWidth: 0.5,
					marginBottom: 10
				}}
			/>
		</>
	)
}

export const Headline = ({ children }) => (
	<Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>
		{children}
	</Text>
)

export const TimelineItem = ({
	title,
	period,
	children,
	employer,
	tags = [],
	location
}) => {
	tags = tags.sort()
	return (
		<View wrap={false} style={{ marginBottom: 10 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 2.5,
					flexWrap: 'wrap'
				}}
			>
				<Text style={{ fontWeight: 'bold' }}>
					{title}, <Text style={{ fontWeight: 'normal' }}>{employer}</Text>
				</Text>
				<Text>{period}</Text>
			</View>

			{children && <Text style={{ marginBottom: 2.5 }}>{children}</Text>}
			{tags && (
				<View style={{ flexDirection: 'row' }}>
					{tags &&
						tags.map(m => (
							<Tag key={m} color={tagColors[m.toLowerCase()]}>
								{m}
							</Tag>
						))}
				</View>
			)}
		</View>
	)
}

export const EducationItem = ({
	institution,
	startDate,
	endDate,
	area,
	studyType
}) => (
	<View wrap={false} style={{ marginBottom: 10 }}>
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginBottom: 2.5
			}}
		>
			<Text style={{ fontWeight: 'bold' }}>
				{area}, {studyType}
			</Text>
			<Text>
				{startDate} - {endDate}
			</Text>
		</View>
		<Text style={{ fontWeight: 'normal' }}>{institution}</Text>
	</View>
)

export const Tag = ({ color = colors.borders, children }) => (
	<View
		style={{
			borderRadius: 2.5,
			borderWidth: 0.5,
			borderColor: color,
			marginRight: 2.5,
			marginVertical: 2.5,
			padding: 2.5,
			backgroundColor: color
		}}
	>
		<Text
			style={{
				fontSize: 6,
				fontWeight: 'bold',
				color: hex('#00000', color) < 10 ? 'white' : 'black'
			}}
		>
			{children}
		</Text>
	</View>
)

// Not meant for anything wrapping pages
export const Box = ({ children, title, color, style = {} }) => (
	<View wrap={false} style={{ marginBottom: 20 }}>
		<SectionHeader color={color}>{title}</SectionHeader>
		<View style={{ ...style }}>
			{children && typeof children === 'string' ? (
				<Text>{children}</Text>
			) : (
				children
			)}
		</View>
	</View>
)

export const Paragraph = ({ children }) => (
	<Text style={{ marginBottom: 5 }}>{children}</Text>
)

export const periodToString = (startDate, endDate) => {
	const start = dayjs(startDate)
	const end = dayjs(endDate)
	const dateformat = 'YYYY'

	if (endDate === startDate) {
		return `${start.format(dateformat)}`
	}

	if (!endDate) {
		return `${start.format(dateformat)} - Present`
	}

	return `${start.format(dateformat)} - ${end.format(dateformat)}`
}
