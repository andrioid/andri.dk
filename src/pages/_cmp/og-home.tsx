/**
 * The site's social card: what a link to andri.dk unfurls to on Bluesky, Slack,
 * or anywhere else. It is the home hero reduced to a 1200x630 frame — the same
 * Night Window gradient, the coffee avatar, the name and the one-line label.
 *
 * The avatar is takumi's persistent "avatar" image (see takumi.ts). Text renders
 * in the frozen Inter cut, so the single-storey `a` reads here exactly as it
 * does on the page this card links to.
 */
export function OgHomeCard({
	name,
	tagline,
}: {
	name: string;
	tagline: string;
}) {
	return (
		<div
			tw="w-full h-full flex flex-col justify-between text-white px-20 py-16"
			style={{
				// The site ground: primary-500 (#0067ad) to black. Kept in sync with
				// the on-screen gradient in page-container.astro.
				backgroundImage: "linear-gradient(to bottom, #0067ad, #000000)",
			}}
		>
			<img
				src="avatar"
				alt=""
				tw="h-32 w-32 rounded-full"
				style={{ border: "2px solid rgba(255,255,255,0.25)" }}
			/>

			<div tw="flex flex-col">
				<h1
					tw="text-8xl font-bold"
					style={{ letterSpacing: "-0.02em" }}
				>
					{name}
				</h1>
				<p tw="text-4xl mt-4" style={{ color: "#74d4ff" }}>
					{tagline}
				</p>
			</div>

			<div tw="text-3xl" style={{ color: "rgba(223,242,254,0.7)" }}>
				andri.dk
			</div>
		</div>
	);
}
