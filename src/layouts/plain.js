import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

const TemplateWrapper = ({ children }) => (
	<div>
		<Helmet
			title="Andri"
			meta={[
				{ name: 'description', content: 'profile' },
				{ name: 'keywords', content: 'sample, something' }
			]}
		/>
		<div>{children()}</div>
	</div>
)

TemplateWrapper.propTypes = {
	children: PropTypes.func
}

export default TemplateWrapper
