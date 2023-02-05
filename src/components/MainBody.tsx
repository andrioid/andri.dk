import { ReactElement } from "react";
import "./weird.css";

export const MainBody = ({
	children,
}: {
	children: ReactElement | ReactElement[];
}) => (
	<body>
		<div>
			<div
				className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-900 animated-background"
				style={{
					//background: `url(${waveBG}) no-repeat`,
					backgroundSize: "cover",
				}}
			>
				{children}
			</div>
		</div>
	</body>
);
