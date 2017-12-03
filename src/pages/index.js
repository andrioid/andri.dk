import React from 'react'
import Link from 'gatsby-link'
import { Image } from 'semantic-ui-react'

import andratar from '../../img/coffee-art.jpg'
import 'typeface-indie-flower'

// Colors: https://material.io/guidelines/style/color.html#color-color-palette "indigo"

const IndexPage = () => (
	<div style={{ display: 'flex', flexDirection: 'column' }}>
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#3D5AFE',
				color: 'lightgrey',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				alignItems: 'center'
			}}
		>
			<div
				style={{
					// backgroundColor: 'darkorange',
					// flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 30,
					textAlign: 'center'
				}}
			>
				<img
					src={andratar}
					style={{
						borderRadius: '50%',
						width: 250,
						boxShadow:
							'0 0 0 3px #dddddd, 0 0 0 4px #ddd, 0 2px 5px 4px rgba(0, 0, 0, 0.2)'
					}}
				/>
				<h1
					style={{ fontFamily: 'indie flower', fontSize: '3.2em' }}
					className="ui heading"
				>
					Hi! I'm Andri
				</h1>
				<h3>I like to build stuff</h3>
			</div>
			<div>
				<i className="big chevron down icon" />
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
		<div
			style={{
				backgroundColor: '#1A237E',
				margin: 0,
				padding: 10,
				justifyContent: 'center',
				alignItems: 'center',
				color: 'white',
				textAlign: 'center'
			}}
		>
			<p>
				Damn it! You have discovered that this site contains no content. I will
				have to fix that.
			</p>
		</div>
	</div>
)

export default IndexPage
