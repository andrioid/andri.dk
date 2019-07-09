import React from 'react'
import classNames from 'classnames'
import { FaCalendarAlt as FaCalendar } from 'react-icons/fa'
import Link from 'gatsby-link'

export const Card = ({
	title,
	description,
	date,
	link,
	tags = [],
	draft = false
}) => (
	<div className="pt-2 sm:pt-4 sm:pr-4 lg:pr-6 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
		<Link to={link}>
			<div
				className={classNames(
					'overflow-hidden shadow-lg bg-white hover:shadow-2xl'
				)}
			>
				<div className="px-6 pt-4 text-sm text-gray-600 flex justify-start items-center">
					<FaCalendar />
					<span className="ml-2">{date}</span>
				</div>
				<div className="px-6 pb-4 ">
					<div className="font-bold text-xl mb-2">{title}</div>
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
