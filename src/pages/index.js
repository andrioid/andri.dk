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
		<nav className="p-8 h-16 border-b border-gray-400 bg-blue-800">
			<ul className="flex">
				<li className="mr-6">
					<a className="text-white hover:text-gray-400" href="#">
						About
					</a>
				</li>
				<li className="block">CV</li>
				<li>Blog</li>
			</ul>
		</nav>
		<div className="flex flex-row m-8 flex-wrap">
			<div className="flex-1 text-gray-900">
				<h2 className="font-headline text-4xl font-bold inline-block my-2">
					Hi, I'm Andri
				</h2>
				<p>I've been glued to screen since I was 8 years old.</p>
				<p>&nbsp;</p>
				<p>Follow me on</p>
			</div>
			<div className="p-4 items-end align-top flex mr-6">
				<img
					src={andratar}
					className="rounded-full shadow-2xl block mx-auto w-32 h-32 md:w-48 md:h-48"
				/>
			</div>
		</div>
		<div className="items-center flex-col">
			<div className="text-center" />
			<div />
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
