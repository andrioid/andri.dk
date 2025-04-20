import html2canvas from "html2canvas";
import { FC, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface PaperScrollProps {
	text: string;
	className?: string;
	efnisflokkur?: string;
	onTryAgain?: () => void;
}

const easterButtonClass =
	"bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow";

export const PaperScroll: FC<PaperScrollProps> = ({
	text,
	efnisflokkur = "",
	className = "",
	onTryAgain,
}) => {
	const divRef = useRef<HTMLDivElement>(null);

	async function handleSave() {
		if (!divRef.current) return;

		const canvas = await html2canvas(divRef.current);
		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "malshattur.png";
		//link.click();
		const newTab = window.open();
		if (newTab) {
			newTab.document.location = dataUrl;
			newTab.document.body.innerHTML = `<img src="${dataUrl}" alt="Málsháttur" />`;
			newTab.document.title = "Málsháttur";
		}
	}

	return (
		<div className="flex flex-col gap-8 items-start">
			<div
				ref={divRef}
				className={twMerge(
					"m-6 flex-col gap-2 bg-yellow-200 min-h-10 py-4 px-10 drop-shadow-2xl transition-[width] duration-800 ease-in-out rotate-1",
					"border border-gray-300",
					!!text ? "w-auto min-w-96 flex" : "w-0 hidden",
					className,
				)}
			>
				<span className="font-medium text-left">{text}</span>
				<div className="text-xs text-gray-400 flex justify-between">
					<span>andri.dk/paskar</span>
					<span>{efnisflokkur}</span>
				</div>
			</div>
			{!!text && (
				<div className="flex flex-row justify-between gap-4">
					<button
						className={twMerge(
							easterButtonClass,
							!!text ? "block" : "hidden",
						)}
						onClick={onTryAgain}
					>
						Prófa aftur?
					</button>
					<button className={easterButtonClass} onClick={handleSave}>
						Geyma
					</button>
				</div>
			)}
		</div>
	);
};
