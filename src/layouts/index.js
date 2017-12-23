import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

// import './index.css'
// import 'semantic-ui-css/semantic.min.css'

const TemplateWrapper = ({ children }) => (
	<div>
		<Helmet
			title="andri.dk"
			meta={[
				{ name: 'description', content: 'Sample' },
				{ name: 'keywords', content: 'sample, something' }
			]}
		/>
		<div className="ui vertical stripe segment">
			<div>
				<h1>Standard layout, with menu</h1>
				{children()}
			</div>
		</div>
	</div>
)

TemplateWrapper.propTypes = {
	children: PropTypes.func
}

export default TemplateWrapper
