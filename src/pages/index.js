import React from 'react'
import Link from 'gatsby-link'
import { graphql } from 'gatsby'

import { Twitter, LinkedIn, Github } from '../components/social-icons'
import 'typeface-indie-flower'
import Img from 'gatsby-image'
import { ILike } from '../components/ilike'
import andratar from '../../static/img/coffee-art.jpg'

// Colors: https://material.io/guidelines/style/color.html#color-color-palette "indigo"

const IndexPage = ({ data }) => (
	<div className="flex flex-col font-sans min-h-screen text-gray-900">
		<div className="items-center flex-col">
			<div className="text-center">
				<Img
					resolutions={data.file.childImageSharp.resolutions}
					className="rounded-full block sm:w-12 mx-auto w-1/2"
				/>
				<h2 className="font-headline bg-yellow-400 text-2xl font-bold inline-block my-8 p-3">
					Hi! I'm Andri
				</h2>
			</div>

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
		<div className="bg-blue-800 text-center flex-row flex justify-center">
			<Github user="andrioid" />
			<Twitter user="andrioid" />
			<LinkedIn user="andriosk" />
		</div>
		<div>
			<i className="big chevron down icon" />
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
