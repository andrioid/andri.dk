import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
	<div className="ui column">
		<h1>Andri frontpage</h1>
		<ul>
			<li>Github</li>
			<li>Twitter</li>
			<li>LinkedIn</li>
		</ul>
		<Link to="/page-2/">Go to page 2</Link>
	</div>
)

export default IndexPage
