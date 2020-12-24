import React from 'react'
import { Nav } from '../components/nav'

const PagesLayout = ({ children }) => (
	<div className="font-sans">
		<Nav />
		<div className="">{children}</div>
	</div>
)

export default PagesLayout
