import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
	<div className="ui column">
		<h1>If you're reading this, I'm sorry</h1>
		<p>Learning Gatsby atm</p>
		<p>
			I was planning on getting this ready before working out the deployment
			things, but Netlify was too easy.
		</p>
		<Link to="/page-2/">Go to page 2</Link>
	</div>
)

export default IndexPage
