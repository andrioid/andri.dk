import type { Skill, Work } from "react-cv";

function durationForWork(start: Date, end: Date) {
	const diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 365;
	return Math.floor(diff);
}

function durationForSkill(work: Array<Work>, skill: string) {
	let sum = 0;
	for (const w of work) {
		if (!w.startDate) {
			continue; // skip if no start date
		}
		const dur = durationForWork(
			new Date(w.startDate),
			w.endDate ? new Date(w.endDate) : new Date(),
		);
		if (w.keywords && w.keywords.indexOf(skill) !== -1) {
			sum += dur;
		}
	}
	return sum;
}

export function dataTransform(
	rootSkills: Array<Skill>,
	workSkills: Array<Work>,
) {
	const skills = rootSkills.map((c) => {
		if (!c.keywords || !workSkills) {
			return {
				...c,
				keywords: [],
			};
		}
		const nk = c.keywords
			.map((k) => {
				const score = durationForSkill(workSkills, k) || 0;
				return {
					name: k,
					// score is currently just duration
					score,
				};
			})
			.filter((k) => {
				if (k.score >= 0.5) return true;
				if (c.id === "processes") return true;
				return false;
			}) // minimum a year
			.sort((a, b) => {
				return b.score - a.score;
			});
		return {
			...c,
			keywords: nk,
		};
	});
	return skills;
}
