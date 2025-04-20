import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface PaperScrollProps {
	text: string;
	className?: string;
	efnisflokkur?: string;
	onTryAgain?: () => void;
}

export const PaperScroll: FC<PaperScrollProps> = ({
	text,
	efnisflokkur = "",
	className = "",
	onTryAgain,
}) => {
	return (
		<div className="flex flex-col gap-8 items-start">
			<div
				className={twMerge(
					"flex-col gap-2 bg-yellow-200 min-h-10 py-4 px-10 drop-shadow-2xl transition-[width] duration-800 ease-in-out rotate-1",
					!!text ? "w-auto min-w-96 flex" : "w-0 hidden",
					className,
				)}
			>
				<span className="font-medium text-left">{text}</span>
				<div className="text-xs text-gray-500 flex justify-end">
					<span>{efnisflokkur}</span>
				</div>
			</div>
			<button
				className={!!text ? "block" : "hidden"}
				onClick={onTryAgain}
			>
				Prófa aftur?
			</button>
		</div>
	);
};
