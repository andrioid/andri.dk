import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import 'typeface-montserrat'
// import './index.css'
import '../css/global.css'
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
		<div style={{ margin: '3rem auto', maxWidth: 600 }}>{children()}</div>
	</div>
)

TemplateWrapper.propTypes = {
	children: PropTypes.func
}

export default TemplateWrapper
