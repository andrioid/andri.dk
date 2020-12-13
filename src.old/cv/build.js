import React from 'react'
import ReactPDF, {
	Document,
	Page,
	View,
	Text,
	Link,
	Image,
	Font,
	StyleSheet
} from '@react-pdf/renderer'
import path from 'path'
import fs from 'fs'

import { CVDoc } from './cv'

Font.register({
	family: 'DefaultFont',
	fonts: [
		{ src: path.join(__dirname, '../../static/fonts/Montserrat-Regular.ttf') },
		{
			src: path.join(__dirname, '../../static/fonts/Montserrat-SemiBold.ttf'),
			fontWeight: 700
		},
		{
			src: path.join(__dirname, '../../static/fonts/Montserrat-Italic.ttf'),
			fontStyle: 'italic'
		}
	]
})

const imageB64 = fs.readFileSync(
	path.join(__dirname, '../../static/img/coffee-art.jpg'),
	'base64'
)

ReactPDF.render(
	<CVDoc image={imageB64} />,
	path.join(__dirname, '../../public/cv.pdf')
)
