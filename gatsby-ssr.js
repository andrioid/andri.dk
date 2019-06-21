import React from 'react'
import { renderToString } from 'react-dom/server'
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

import { CVFrontpage } from './src/pages/cv'
import andriPic from './src/assets/img/coffee-art.jpg'
const andriPic2 = require('./src/assets/img/coffee-art.jpg')

console.log('andirpic', andriPic, andriPic2, __dirname)

//console.log('ssr stuff happening')
const imagePath = `${process.env.GATSBY_SSR_DIRNAME}${andriPic}`
console.log('imagepath', imagePath)

export const replaceRenderer = ({
	bodyComponent,
	replaceBodyHTMLString,
	setHeadComponents
}) => {
	replaceBodyHTMLString(renderToString(<bodyComponent />))
}

try {
	ReactPDF.render(
		<Document>
			<CVFrontpage />
		</Document>,
		`./example.pdf`
	)
} catch (err) {
	console.error('Ooops, no PDF for you', err)
}
