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
