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
		<div style={{ minimumHeight: '100vh', borderWidth: 1, borderColor: 'red' }}>
			<div className="ui aligned center masthead segment vertical">
				<div className="ui container">
					<div className="large menu pointing secondary ui">
						<a className="toc item">
							<i className="sidebar icon" />
						</a>
						<a className="active item">Home</a>
						<a className="item">Personal</a>
						<a className="item">Work</a>
						<a className="item">Links</a>
						<div className="right item">
							<a className="ui inverted button">Log in</a>
							<a className="ui inverted button">Sign Up</a>
						</div>
					</div>{' '}
				</div>
				<div className="ui text container">
					<h1 className="ui header">Andri</h1>
				</div>
			</div>
			<div className="ui vertical stripe segment">
				<div>
					<h1>Standard layout, with menu</h1>
					{children()}
				</div>
			</div>
			<div className="ui inverted vertical footer segment">
				<div className="ui container">
					<div className="ui stackable inverted divided equal height stackable grid">
						<div className="three wide column">
							<h4 className="ui inverted header">About</h4>
							<div className="ui inverted link list">
								<a href="#" className="item">
									Sitemap
								</a>
								<a href="#" className="item">
									Contact Us
								</a>
								<a href="#" className="item">
									Religious Ceremonies
								</a>
								<a href="#" className="item">
									Gazebo Plans
								</a>
							</div>
						</div>
						<div className="three wide column">
							<h4 className="ui inverted header">Services</h4>
							<div className="ui inverted link list">
								<a href="#" className="item">
									Banana Pre-Order
								</a>
								<a href="#" className="item">
									DNA FAQ
								</a>
								<a href="#" className="item">
									How To Access
								</a>
								<a href="#" className="item">
									Favorite X-Men
								</a>
							</div>
						</div>
						<div className="seven wide column">
							<h4 className="ui inverted header">Footer Header</h4>
							<p>
								Extra space for a call to action inside the footer that could
								help re-engage users.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
)

TemplateWrapper.propTypes = {
	children: PropTypes.func
}

export default TemplateWrapper
