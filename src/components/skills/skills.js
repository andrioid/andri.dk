import React, { useEffect, useState, useMemo } from 'react'

export function SkillDataTransform({ workSkills, rootSkills, children }) {
	const skills = useMemo(() => {
		const newSkills = rootSkills.slice()
		for (const c of newSkills) {
			c.keywords = c.keywords.sort((a, b) => {
				return a > b
			})
		}
		return newSkills
	}, [workSkills, rootSkills])

	return children(skills)
}

export function Skills({ categories }) {
	console.log(categories)
	if (!categories) {
		console.log(categories)
		return null
	}
	return (
		<div className="flex flex-row flex-wrap justify-between">
			{categories.map(c => (
				<div
					key={c.name}
					className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col p-6 md:p-0 mb-4 lg:mb-0"
				>
					<h2
						className="font-light uppercase text-base mb-4"
						style={{ color: c.color }}
					>
						{c.name}
					</h2>
					<div className="">
						{c.keywords.map(s => (
							<span
								key={s}
								className="tag"
								style={{
									backgroundColor: c.color
								}}
							>
								{s}
							</span>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
