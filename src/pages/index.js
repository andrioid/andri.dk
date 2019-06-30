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
	<>
		<div className="flex flex-col font-sans min-h-one-third-screen text-white bg-indigo-900">
			<nav className="flex items-end justify-end p-6">
				<ul className="flex flex-row">
					<NavLink href="#">About</NavLink>
					<NavLink href="#">CV</NavLink>
					<NavLink href="#">Blog</NavLink>
				</ul>
			</nav>
			<div className="mx-10 md:mx-20 lg:mx-40 flex flex-row flex-wrap font-headline text-2xl">
				<div className="flex-1">
					<h2 className="font-headline md:text-6xl text-3xl font-bold inline-block my-2">
						Hi, I'm Andri 👋
					</h2>
					<p>I've been glued to screen since I was 8 years old.</p>
				</div>
				<div className="p-4 items-start justify-start flex mr-6">
					<img
						src={andratar}
						className="rounded-full shadow-2xl block mx-auto w-32 h-32 md:w-48 md:h-48"
					/>
				</div>
			</div>
		</div>
		<Section title="Latest Articles">
			<div className="flex flex-row flex-wrap justify-start">
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
			</div>
		</Section>
		<Section title="Skills" bgColorLevel={100}>
			all is good
		</Section>

		<Section className="bg-pink-300" title="Woof">
			bla bla
		</Section>
		<div className="font-headline text-xl flex flex-row font-sans h-16 text-white bg-indigo-900 align-middle items-center justify-center">
			That's all folks
		</div>
	</>
)

const NavLink = ({ href, children }) => (
	<li className="mr-6">
		<a className="text-white hover:text-gray-400" href={href}>
			{children}
		</a>
	</li>
)

// Wraps the text and handles margins
const BodyContainer = ({ children, className }) => (
	<div className="mt-10 mx-10 md:mx-20 lg:mx-40 text-xl">{children}</div>
)

const Section = ({
	children,
	title,
	bgColorBase = 'gray',
	bgColorLevel = 200
}) => (
	<div
		className={`pt-10 pb-20 px-10 md:px-20 lg:px-40 text-xl bg-${bgColorBase}-${bgColorLevel}`}
	>
		<h2 className="font-headline font-bold text-3xl md:text-4xl mb-2">
			{title}
		</h2>
		{children}
	</div>
)

function classes(existing = '', overrides = '') {
	const cl = classNames.split(' ')
}

const Card = ({ children }) => (
	<div className="pb-2 sm:p-2 md:p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
		<div className="overflow-hidden shadow-lg bg-white ">
			<div className="px-6 py-4 ">
				<div className="font-bold text-xl mb-2">The Coldest Sunset</div>
				<p className="text-gray-700 text-base">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
					quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
					nihil.
				</p>
			</div>
			<div className="px-6 py-4">
				<span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
					#photography
				</span>
				<span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
					#travel
				</span>
				<span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
					#winter
				</span>
			</div>
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
