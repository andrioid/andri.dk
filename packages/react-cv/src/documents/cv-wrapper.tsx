import { Resume, Skill } from "src/components/resume-types";
import { durationForKeyword } from "src/components/utils";
import { getColor } from "src/theme";
import { CVDocument } from "./cv";

export function CVWrapper({ resume }: { resume: Resume }) {
	const { work, education, basics, skills } = resume;

	const skillsWithSortedKeywords = resume.skills?.map((c) => {
		const durations: Record<string, number> = {};
		c.keywords?.forEach((kw, idx) => {
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

function skillToColor(skillProp: string, skills: Skill[]): string | undefined {
	if (!skillProp) {
		return;
	}

	let m = skillProp;
	if (Array.isArray(skillProp)) {
		m = skillProp[0];
	}

	if (skills && typeof m === "string") {
		const idx = skills.findIndex((skill: Skill) => {
			const match = skill?.keywords?.findIndex(
				(k) => k.toLowerCase() === m.toLowerCase()
			);
			if (match && match > -1) {
				return true;
			}
			return false;
		});

		if (skills[idx]?.id && getColor(skills[idx].id!)) {
			return getColor(skills[idx].id!);
		}
	}
	return;
}
