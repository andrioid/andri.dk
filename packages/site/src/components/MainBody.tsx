import * as React from "react";
import waveBG from "../../static/img/wave.svg";
import "./weird.css";

export const MainBody = ({ children }) => (
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
