import React from 'react'
import Link from 'gatsby-link'
import { graphql } from 'gatsby'

import { Twitter, LinkedIn, Github } from '../components/social-icons'
import andratar from '../../img/coffee-art.jpg'
//import 'typeface-indie-flower'
import Img from 'gatsby-image'
import { ILike } from '../components/ilike'

// Colors: https://material.io/guidelines/style/color.html#color-color-palette "indigo"

const IndexPage = ({ data }) => (
	<div className="container mx-auto px-4">
		<div />

		<div>
			<div>
				<Img
					resolutions={data.file.childImageSharp.resolutions}
					className="h-16 w-16 rounded-full mx-auto "
				/>
				<h1>Hi! I'm Andri</h1>
				<ILike
					like={[
						'React',
						'Go',
						'Docker',
						'Kubernetes',
						'Javascript',
						'Networking',
						'Cloud Computing',
						'DadOps',
						'LaTeX',
						'PostgreSQL',
						'GraphQL',
						'Linux',
						'GatsbyJS',
						'React Native',
						'UX',
						'Product Development',
						'Programming',
						'DevOps',
						'Arcade Games',
						'Cooking',
						'Coffee',
						'Gadgets',
						'Sci-Fi'
					]}
				/>
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
