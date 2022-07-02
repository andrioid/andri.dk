import * as React from "react";
import waveBG from "../../static/img/wave.svg";

export const MainBody = ({ children }) => (
	<body>
		<div
			className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-700"
			style={{
				background: `url(${waveBG}) no-repeat`,
				backgroundSize: "cover",
				//backgroundImage: `url(${waveBG})`,
			}}
		>
			{children}
		</div>
	</body>
);
