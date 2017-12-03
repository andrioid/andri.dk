import React from 'react'
import Link from 'gatsby-link'
import { Image } from 'semantic-ui-react'

import andratar from '../../img/coffee-art.jpg'

// Colors: https://material.io/guidelines/style/color.html#color-color-palette "indigo"

const IndexPage = () => (
	<div>
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#3F51B5',
				color: 'lightgrey',
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<div
				style={{
					// backgroundColor: 'darkorange',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 30,
					textAlign: 'center'
				}}
			>
				<Image size="medium" src={andratar} circular />
				<h1>Hi! I'm Andri</h1>
			</div>
			{/* <div
				style={{
					position: 'absolute',
					top: '50%',
					backgroundColor: 'red',
					transform: [{ translateY: '-50%' }]
				}}
			>
				<div>
					<h1>If you're reading this, I'm sorry</h1>
					<p>
						My plan was to learn Gatsby, migrate all my stuff and learn Netlify
						deployment.
					</p>
					<p>
						However, I learned to deploy with Netlify before anything else, so
						bear with me.
					</p>
					<Link to="/page-2/">Go to page 2</Link>
				</div>
			</div> */}
		</div>
		<div>
			<p>banana</p>
		</div>
	</div>
)

export default IndexPage
