import { useState } from "react";
import type { dataTransform } from "../../lib/cv";
import { twMerge } from "tailwind-merge";

export function SkillOverview({
	skills: dt,
}: {
	skills: ReturnType<typeof dataTransform>;
}) {
	const [selected, setSelected] = useState(0);
	return (
		<div
			id="skills"
			className="mt-8 flex flex-col items-center max-w-[50em]"
		>
			<ul className="flex flex-wrap justify-center gap-2">
				{dt.map((skill, index) => (
					<li
						role="button"
						onClick={() => setSelected(index)}
						aria-selected={index === selected}
						className="bg-sky-800 px-3 py-1 rounded-full text-sm hover:bg-sky-600 transition-colors text-sky-100 aria-selected:bg-sky-600"
					>
						{skill.name}
					</li>
				))}
			</ul>
			<ul
				className={twMerge(
					"invisible flex-wrap justify-center gap-2 mt-6 transition-opacity opacity-0 duration-700 ease-in-out",
					"flex visible opacity-100",
				)}
			>
				{dt[selected].keywords.map((k) => (
					<li className="text-sm px-3 py-1 rounded-full bg-sky-100 text-sky-800">
						{k.name}
					</li>
				))}
			</ul>
		</div>
	);
}
