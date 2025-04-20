import { actions } from "astro:actions";
import { useState } from "react";
import { PaperScroll } from "~/pages/paskar/_cmp/paper-scroll";

export function PaskaEgg() {
	const [isCracked, setIsCracked] = useState(false);
	const [text, setText] = useState("");
	const [error, setError] = useState("");

	if (error) {
		return (
			<PaperScroll
				text={error}
				className="bg-red-200"
				onTryAgain={handleTryAgain}
			/>
		);
	}

	if (text) {
		return <PaperScroll text={text} onTryAgain={handleTryAgain} />;
	}

	async function handleCrack() {
		setIsCracked(true);
		const { data, error } = await actions.paskar.malshattur();
		if (data) {
			console.log("Data: ", data.response);
			setText(data.response);
		} else if (error) {
			setError(
				"Villa kom upp. Gervigreindin er sennilega orðin þreytt...",
			);
			console.error(error);
		}
	}

	async function handleTryAgain() {
		setIsCracked(false);
		setText("");
		setError("");
	}

	return (
		<svg
			viewBox="0 0 200 300"
			className="cursor-pointer h-96 w-auto"
			onClick={handleCrack}
		>
			{/* Spinner (appears when cracked) */}
			{isCracked && (
				<g transform="translate(100, 150)">
					<circle
						r="20"
						fill="none"
						stroke="#643200"
						strokeWidth="4"
						strokeDasharray="80"
						style={{
							animation: "spin 1s linear infinite",
						}}
					/>
				</g>
			)}
			{/* Egg bottom half */}
			<path
				d="M40 150 C40 230, 160 230, 160 150 C160 70, 100 20, 100 20 C100 20, 40 70, 40 150"
				fill="#8B4513"
				stroke="#643200"
				strokeWidth="4"
				transform={isCracked ? "translate(100, 20)" : ""}
				style={{
					transition:
						"transform 1.5s ease-in-out, opacity 2s ease-in-out",
					opacity: isCracked ? 0 : 1,
				}}
			/>
			{/* Egg top half */}
			<path
				d="M40 150 C40 70, 100 20, 100 20 C100 20, 160 70, 160 150"
				fill="#8B4513"
				stroke="#643200"
				strokeWidth="4"
				transform={isCracked ? "translate(-100, 0)" : ""}
				style={{
					transition:
						"transform 1.5s ease-in-out, opacity 2s ease-in-out",
					opacity: isCracked ? 0 : 1,
				}}
			/>
			{/* Decorative lines */}
			<path
				d="M70 100 C70 140, 130 140, 130 100"
				fill="none"
				stroke="#643200"
				strokeWidth="2"
				opacity={isCracked ? 0 : 0.5}
				style={{
					transition: "opacity 1s ease-in-out",
				}}
			/>
			<path
				d="M80 80 C80 120, 120 120, 120 80"
				fill="none"
				stroke="#643200"
				strokeWidth="2"
				opacity={isCracked ? 0 : 0.5}
				style={{
					transition: "opacity 1s ease-in-out",
				}}
			/>
		</svg>
	);
}
