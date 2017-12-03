import React from 'react'

import GithubIcon from 'react-icons/lib/fa/github'
import LinkedInIcon from 'react-icons/lib/fa/linkedin'
import TwitterIcon from 'react-icons/lib/fa/twitter'

const width = 36
const height = 36

const iconResolver = type => {
	switch (type) {
		case 'twitter':
			return TwitterIcon
		case 'linkedin':
			return LinkedInIcon
		case 'github':
			return GithubIcon
		default:
			throw new Error(`Type '${type}' not found in iconResolver`)
	}
}

const linkResolver = (user, type) => {
	switch (type) {
		case 'twitter':
			return `https://www.twitter.com/${user}`
		case 'github':
			return `https://github.com/${user}`
		case 'linkedin':
			return `https://www.linkedin.com/in/${user}`
		default:
			throw new Error(`Type '${type}' not found in linkResolver`)
	}
}

const BaseLink = (user, type) => {
	const Icon = iconResolver(type)
	const href = linkResolver(user, type)
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			style={{ margin: 5 }}
		>
			<Icon style={{ color: 'white', width, height }} />
		</a>
	)
}

export const Twitter = ({ user }) => BaseLink(user, 'twitter')
export const LinkedIn = ({ user }) => BaseLink(user, 'linkedin')
export const Github = ({ user }) => BaseLink(user, 'github')
