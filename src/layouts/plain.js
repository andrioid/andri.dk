import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

export const PlainLayout = ({ children }) => (
	<div>
		<Helmet
			title="Andri"
			meta={[
				{ name: 'description', content: 'profile' },
				{ name: 'keywords', content: 'sample, something' }
			]}
		/>
		<div className="pineapple">{children()}</div>
	</div>
)

PlainLayout.propTypes = {
	children: PropTypes.func
}
