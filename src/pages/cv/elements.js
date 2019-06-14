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

const colors = {
	borders: '#d3d3d3'
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

export const SectionHeader = ({ children }) => (
	<>
		<Text style={{ fontWeight: 'bold' }}>{children.toUpperCase()}</Text>
		<View
			style={{
				width: 'auto',
				height: 1,
				borderBottomColor: colors.borders,
				borderBottomWidth: 1,
				marginBottom: 10
			}}
		/>
	</>
)

export const Headline = ({ children }) => (
	<Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>
		{children}
	</Text>
)

export const ExperienceItem = ({
	title,
	period,
	children,
	employer,
	tags,
	location
}) => (
	<View style={{ marginBottom: 10 }}>
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginBottom: 5
			}}
		>
			<Text style={{ fontWeight: 'bold' }}>
				{title}, <Text style={{ fontWeight: 'normal' }}>{employer}</Text>
			</Text>
			<Text>{period}</Text>
		</View>

		<Text>{children}</Text>
		<View style={{ flexDirection: 'row' }}>
			{tags &&
				tags.map(m => (
					<View
						style={{
							borderRadius: 2.5,
							borderWidth: 0.5,
							borderColor: colors.borders,
							marginRight: 2.5,
							marginVertical: 2.5,
							padding: 2.5,
							backgroundColor: '#e3e3d3'
						}}
					>
						<Text
							style={{
								fontSize: 6
							}}
						>
							{m}
						</Text>
					</View>
				))}
		</View>
	</View>
)

export const Box = ({ children, title }) => (
	<View style={{ marginBottom: 20 }}>
		<SectionHeader>{title}</SectionHeader>
		{children}
	</View>
)
