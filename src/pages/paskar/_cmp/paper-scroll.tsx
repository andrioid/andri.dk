import { FC, useEffect, useState } from "react";

interface PaperScrollProps {
	text: string;
	className?: string;
	onTryAgain?: () => void;
}

export const PaperScroll: FC<PaperScrollProps> = ({
	text,
	className = "",
	onTryAgain,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [showText, setShowText] = useState(false);

	useEffect(() => {
		setIsVisible(true);
		const timer = setTimeout(() => setShowText(true), 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex flex-col gap-4 items-start">
			<div
				className={`bg-yellow-200 min-h-10 p-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
					isVisible ? "w-full" : "w-0 overflow-hidden"
				} ${className}`}
			>
				{showText && text}
			</div>
			<button onClick={onTryAgain}>Prófa aftur?</button>
		</div>
	);
};
