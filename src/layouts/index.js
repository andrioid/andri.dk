import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import 'typeface-montserrat'
// import '../css/global.css'

const TemplateWrapper = ({ children }) => (
	<div>
		<div className="layoutplain" style={{ margin: '3rem auto', maxWidth: 600 }}>
			{children()}
		</div>
	</div>
)

TemplateWrapper.propTypes = {
	children: PropTypes.func
}

export default TemplateWrapper
