import { Resume } from "src/components/resume-types";
import { durationForKeyword } from "src/components/utils";
import { CVDocument } from "./cv";

export function CVWrapper({ resume }: { resume: Resume }) {
	const { work, education, basics } = resume;

	const skillsWithSortedKeywords = resume.skills?.map((c) => {
		const durations: Record<string, number> = {};
		c.keywords?.forEach((kw) => {
			if (!resume.work) {
				return;
			}
			durations[kw] = durationForKeyword(resume.work, kw);
		});
		const nk = c.keywords?.sort((a, b) => {
			return durations[b] - durations[a];
		});
		return { ...c, keywords: nk };
	});

	const sortedWork = work?.map((w) => {
		if (!w.keywords) {
			return w;
		}
		const kw = [...w.keywords].sort((a, b) => {
			return a.localeCompare(b);
		});
		return {
			...w,
			keywords: kw,
		};
	});
	/* 
	return {
		skills: skillsWithSortedKeywords,
		basics,
		work: sortedWork,
		education,
		skillToColor: (skill: string) =>
			(skillsWithSortedKeywords &&
				skillToColor(skill, skillsWithSortedKeywords)) ||
			undefined,
	}; */

	if (!skillsWithSortedKeywords || !basics || !sortedWork || !education) {
		throw new Error("CV props cannot be empty");
	}

	return (
		<CVDocument
			skills={skillsWithSortedKeywords}
			basics={basics}
			work={sortedWork}
			education={education}
		/>
	);
}
