import React from 'react'
import Link from 'gatsby-link'

import { Twitter, LinkedIn, Github } from '../components/social-icons'
import andratar from '../../img/coffee-art.jpg'
import 'typeface-indie-flower'
import Img from 'gatsby-image'

// Colors: https://material.io/guidelines/style/color.html#color-color-palette "indigo"

const IndexPage = ({ data }) => (
	<div
		style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
	>
		<div
			style={{
				top: 0,
				left: 0,
				width: '100%',
				height: 10,
				backgroundColor: '#8C9EFF'
			}}
		/>

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
				<Img
					resolutions={data.file.childImageSharp.resolutions}
					style={{
						borderRadius: '50%',
						width: 250,
						height: 250,
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
				<h3>I like computers.</h3>
			</div>
			<div>
				<Github user="andrioid" />
				<Twitter user="andrioid" />
				<LinkedIn user="andriosk" />
			</div>
			<div>
				<i className="big chevron down icon" />
			</div>
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

export const query = graphql`
	query GatsbyImageSampleQuery {
		file(relativePath: { eq: "coffee-art.jpg" }) {
			childImageSharp {
				# Specify the image processing specifications right in the query.
				# Makes it trivial to update as your page's design changes.
				resolutions(width: 250, height: 250) {
					...GatsbyImageSharpResolutions
				}
			}
		}
	}
`

export default IndexPage
