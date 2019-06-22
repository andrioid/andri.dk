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

import { CVDoc } from './cv'

//import MontserratRegular from '../../static/fonts/Montserrat-Regular.ttf'
//import MontserratSemiBold from '../../static/fonts/Montserrat-SemiBold.ttf'
//import MontserratItalic from '../../static/fonts/Montserrat-Italic.ttf'

Font.register({
	family: 'DefaultFont',
	fonts: [
		{ src: `${__dirname}/fonts/Montserrat-Regular.ttf` },
		{
			src: `${__dirname}/fonts/Montserrat-SemiBold.ttf`,
			fontWeight: 700
		},
		{
			src: `${__dirname}/fonts/Montserrat-Italic.ttf`,
			fontStyle: 'italic'
		}
	]
})

ReactPDF.render(<CVDoc />, `${__dirname}/output.pdf`)
