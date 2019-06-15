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
	<div className="flex flex-col font-sans min-h-screen text-gray-900">
		<div className="items-center flex-col" style={{ border: '1px solid red' }}>
			<div className="text-center">
				<Img
					resolutions={data.file.childImageSharp.resolutions}
					className="block sm:w-12 mx-auto w-1/2"
				/>
				<h2 className="bg-yellow-400 text-2xl font-bold inline-block my-8 p-3">
					Hi! I'm Andri
				</h2>
			</div>
			<div>
				<div className="max-w-sm mx-auto flex p-6 bg-white rounded-lg shadow-xl">
					<div className="flex-shrink-0">
						<img class="h-12 w-12" src={andratar} alt="ChitChat Logo" />
					</div>
					<div className="ml-6 pt-1">
						<h4 className="text-xl text-gray-900 leading-tight">ChitChat</h4>
						<p className="text-base text-gray-600 leading-normal">
							You have a new message!
						</p>
					</div>
				</div>
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
		<div>
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
