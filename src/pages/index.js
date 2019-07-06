import React from 'react'
import Link from 'gatsby-link'
import { graphql } from 'gatsby'
import classNames from 'classnames'

import { Twitter, LinkedIn, Github } from '../components/social-icons'
import Img from 'gatsby-image'
import { ILike } from '../components/ilike'
import andratar from '../../static/img/coffee-art.jpg'
import { SkillDataTransform, Skills } from '../components/skills/skills'

const IndexPage = ({ data }) => (
	<>
		<div className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-600">
			<nav className="flex items-end justify-end justify-between items-center p-8">
				<img
					src={andratar}
					className="rounded-full shadow-2xl w-16 h-16 md:invisible"
				/>
				<div>
					<ul className="flex flex-row">
						<NavLink href="blog/">Blog</NavLink>
						<NavLink href="cv.pdf">CV</NavLink>
					</ul>
				</div>
			</nav>
			<div className="mx-10 md:mx-20 pb-8 lg:mx-40 flex flex-row flex-wrap font-headline text-2xl">
				<div className="flex-1">
					<h2 className="font-headline md:text-6xl text-3xl font-semibold inline-block my-2">
						Hi, I'm Andri &nbsp; 👋
					</h2>
					<div className="text-lg md:text-2xl">
						<p>
							Computer Engineer from <span aria-hidden>🇮🇸</span>
							<span hidden>Iceland</span> living in <span aria-hidden>🇩🇰</span>
							<span hidden>Denmark</span>
						</p>
						<p>&nbsp;</p>
						<p>
							I make websites, create apps, manage infrastructure, develop
							products and more.
						</p>
					</div>
				</div>
				<div className="hidden md:block p-4 items-start justify-start flex mr-6">
					<img
						src={andratar}
						className="rounded-full shadow-2xl block mx-auto md:w-48 md:h-48"
					/>
				</div>
			</div>
		</div>
		<Section title="Latest Posts">
			<ArticleList posts={data.allMarkdownRemark.edges} />
			<div className="btn mt-8 border-gray-400 border bg-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 m-2">
				<Link to="/blog">More posts...</Link>
			</div>
		</Section>
		<Section title="Technology" bgColorLevel={100}>
			<div className="text-sm mb-4 italic">
				Ordered by experience. Heart indicates "want to work with".
			</div>
			<SkillDataTransform
				workSkills={data.cvJson.work}
				rootSkills={data.cvJson.skills}
			>
				{categories => (
					<Skills
						categories={categories}
						focus={['React', 'Go', 'Linux', 'Postgres', 'React Native']}
					/>
				)}
			</SkillDataTransform>
		</Section>

		<div className="font-headline text-xl flex flex-row font-sans h-16 text-white bg-blue-600 align-middle items-center justify-center">
			That's all folks
		</div>
	</>
)

const ArticleList = ({ posts }) => (
	<div className="flex flex-row flex-wrap justify-start">
		{posts
			.filter(post => post.node.frontmatter.title.length > 0)
			.map(({ node: post }) => {
				return (
					<Card
						key={post.id}
						title={post.frontmatter.title}
						link={post.frontmatter.path}
						description={post.excerpt}
						tags={post.frontmatter.tags}
						date={post.frontmatter.date}
						draft={
							process.env.NODE_ENV !== 'production' && post.frontmatter.draft
						}
					/>
				)
			})}
	</div>
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
		className={`pt-10 pb-20 md:px-20 lg:px-40 text-xl bg-${bgColorBase}-${bgColorLevel}`}
	>
		<h2 className="font-headline ml-6 md:ml-0 font-semibold text-xl md:text-2xl mb-0 uppercase">
			{title}
		</h2>
		{children}
	</div>
)

const Card = ({ title, description, date, link, tags = [], draft = false }) => (
	<div
		className={classNames(
			'pb-2 sm:p-2 md:p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4'
		)}
	>
		<div className={classNames('overflow-hidden shadow-lg bg-white ')}>
			<div className="px-6 pt-4 text-sm text-gray-600 flex justify-start">
				<p>{date}</p>
			</div>
			<div className="px-6 pb-4 ">
				<div className="font-bold text-xl mb-2">
					<Link to={link}>{title}</Link>
				</div>
				<div className="text-gray-700 text-base whitespace-pre-line">
					{description}
				</div>
			</div>
			<div className="px-6 py-4">
				{draft ? (
					<span className="tag text-white bg-red-400">Draft</span>
				) : null}

				{tags.map(t => (
					<span key={t} className="tag">
						{t}
					</span>
				))}
			</div>
		</div>
	</div>
)

export const query = graphql`
	query ArticleList {
		allMarkdownRemark(
			limit: 4
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { fields: { draft: { ne: true } } }
		) {
			edges {
				node {
					excerpt(pruneLength: 150)
					id
					frontmatter {
						title
						date(formatString: "YYYY-MM-DD")
						path
						tags
						draft
					}
				}
			}
		}
		cvJson {
			skills {
				name
				level
				keywords
				color
			}
			work {
				company
				startDate
				endDate
				skills
			}
		}
	}
`

export default IndexPage
