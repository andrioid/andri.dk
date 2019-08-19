const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const buffer = require('buffer')

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Overlay } from './overlay'

export async function generateCard({ title = '', subtitle = '' }, oname) {
	const iname = path.join(__dirname, './src/header.svg')
	const pname = path.join(__dirname, './src/plain.svg')

	const svgbuffer = Buffer.from(
		ReactDOMServer.renderToStaticMarkup(
			<Overlay title={title} subtitle={subtitle} />
		)
	)

	const infile = new fs.ReadStream(iname)
	const ostream = fs.WriteStream(oname)

	const overlayer = sharp()
		.resize({ width: 1200, height: 600 })
		.composite([{ input: svgbuffer, blend: 'over' }])
		.jpeg()
	return infile.pipe(overlayer).pipe(ostream)
}
