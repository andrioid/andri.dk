import React from 'react'
import { Nav } from '../components/nav'

const PagesLayout = ({ children }) => (
	<>
		<Nav />
		<div className="markdown">
			<h1>Pages</h1>
			{children}
		</div>
	</>
)

export default PagesLayout
