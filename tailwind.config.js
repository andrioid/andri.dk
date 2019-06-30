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
			sans: ['montserrat', 'helvetica', 'arial'],
			headline: ['montserrat', 'helvetica', 'arial']
		},
		extend: {}
	},
	variants: {},
	plugins: []
}
