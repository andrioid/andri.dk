const sizes = {
	height: {
		'half-screen': '50vh',
		'one-third-screen': '33vh'
	},
	width: {
		'half-screen': '50vw',
		'one-third-screen': '33vw'
	}
}

module.exports = {
	theme: {
		minWidth: sizes.width,
		maxWidth: sizes.width,
		minHeight: sizes.height,
		maxHeight: sizes.height,
		fontFamily: {
			sans: ['Montserrat', 'helvetica', 'arial'],
			headline: ['Montserrat']
		},
		extend: {}
	},
	variants: {},
	plugins: []
}
