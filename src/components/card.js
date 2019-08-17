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
	date,
	link,
	tags = [],
	draft = false
}) => (
	<div className="pt-2 sm:pt-4 sm:pr-4 lg:pr-6 w-full sm:w-1/2 xl:w-1/3">
		<Link to={link}>
			<div className="osverflow-hidden shadow-lg bg-white hover:shadow-2xl h-auto md:h-350 h-350">
				<div className="flex flex-col px-6 pb-4 bg-green-200 justify-between h-full">
					<div className="mt-4 text-sm text-gray-600 flex justify-start items-center">
						<FaCalendar />
						<span className="ml-2">{date}</span>
					</div>

					<div className="flex mt-1 font-bold text-lg lg:text-xl mb-2">
						{title}
					</div>
					<div className="flex flex-1 text-gray-700 text-base bg-pink-200 h-20">
						<p className="">{description}</p>
					</div>
					{tags.length > 0 ? (
						<div className="bg-purple-200 px-6 py-4">
							{tags.slice(0, 3).map(t => (
								<span key={t} className="tag">
									{t}
								</span>
							))}
							{draft ? (
								<span className="tag text-white bg-red-400">Draft</span>
							) : null}
						</div>
					) : null}
				</div>

				<div className="px-6 py-4"></div>
			</div>
		</Link>
	</div>
)
