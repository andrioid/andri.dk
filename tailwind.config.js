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
		extend: {
			minWidth: sizes.width,
			maxWidth: sizes.width,
			minHeight: sizes.height,
			maxHeight: sizes.height,
			fontFamily: {
				sans: ['montserrat', 'helvetica', 'arial'],
				headline: ['montserrat', 'helvetica', 'arial'],
				mono: ['source code pro']
			}
		}
	},
	variants: {},
	plugins: [
		function({ addBase, config }) {
			addBase({
				h1: { fontSize: config('theme.fontSize.2xl') },
				h2: { fontSize: config('theme.fontSize.xl') },
				h3: { fontSize: config('theme.fontSize.lg') }
			})
		}
	]
}
