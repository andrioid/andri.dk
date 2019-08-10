import React from 'react'
import classNames from 'classnames'
import { FaCalendarAlt as FaCalendar } from 'react-icons/fa'
import Link from 'gatsby-link'

function createMarkup(markup) {
	return {
		__html: markup
	}
}

export const Card = ({
	title,
	description,
	descriptionHTML,
	date,
	link,
	tags = [],
	draft = false
}) => (
	<div className="pt-2 sm:pt-4 sm:pr-4 lg:pr-6 w-full sm:w-1/2 xl:w-1/3">
		<Link to={link}>
			<div className="overflow-hidden shadow-lg bg-white hover:shadow-2xl justify-between flex flex-col h-auto md:h-350">
				<div className="px-6 pb-4 ">
					<div className="mt-4 text-sm text-gray-600 flex justify-start items-center">
						<FaCalendar />
						<span className="ml-2">{date}</span>
					</div>

					<div className="mt-1 font-bold text-lg lg:text-xl mb-2">{title}</div>
					<div className="text-gray-700 text-base whitespace-pre-line">
						{description}
					</div>
				</div>
				<div className="px-6 py-4">
					{draft ? (
						<span className="tag text-white bg-red-400">Draft</span>
					) : null}

					{tags.slice(0, 3).map(t => (
						<span key={t} className="tag">
							{t}
						</span>
					))}
				</div>
			</div>
		</Link>
	</div>
)
