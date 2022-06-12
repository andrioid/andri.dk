import { useMemo } from "react";

//import { FaHeart } from "react-icons/fa";
function durationForWork(work) {
	const start = work.startDate && new Date(work.startDate);
	const end = (work.endDate && new Date(work.endDate)) || new Date();

	const diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 365;
	return Math.floor(diff);
}

function durationForSkill(work, skill) {
	let sum = 0;
	for (const w of work) {
		const dur = durationForWork(w);
		if (w.skills && w.skills.indexOf(skill) !== -1) {
			sum += dur;
		}
	}
	return sum;
}

export function dataTransform(rootSkills, workSkills) {
	return rootSkills.map((c) => {
		const nk = c.keywords
			.map((k) => {
				return {
					name: k,
					// score is currently just duration
					score: (workSkills && durationForSkill(workSkills, k)) || 0,
				};
			})
			.sort((a, b) => {
				return b.score - a.score;
			});
		return {
			...c,
			keywords: nk,
		};
	});
}

export function SkillDataTransform({ workSkills, rootSkills, children }) {
	const categories = useMemo(() => {
		const sortedCategories = rootSkills.map((c) => {
			const nk = c.keywords
				.map((k) => {
					return {
						name: k,
						// score is currently just duration
						score:
							(workSkills && durationForSkill(workSkills, k)) ||
							0,
					};
				})
				.sort((a, b) => {
					return b.score - a.score;
				});
			return {
				...c,
				keywords: nk,
			};
		});

		return sortedCategories;
	}, [workSkills, rootSkills]);

	return children(categories);
}

export function Skills({ categories, focus = [] }) {
	if (!categories) {
		return null;
	}
	return (
		<div className="flex flex-row flex-wrap justify-between">
			{categories.map((c) => (
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
						{c.keywords &&
							c.keywords.map((s) => (
								<span
									key={s.name}
									className="andri-tag"
									style={{
										backgroundColor: c.color,
									}}
								>
									{s.name}
									{focus.includes(s.name) ? (
										// Insert icon here
										<span className="ml-2 inline text-red-700" />
									) : null}
								</span>
							))}
					</div>
				</div>
			))}
		</div>
	);
}
