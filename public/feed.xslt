<?xml version="1.0" encoding="utf-8"?>
<!--
	The human face of both web feeds: /rss.xml and /activity.xml. A feed reader never
	sees this, so nothing here may change the XML a reader parses.

	Self-contained by necessity — a stylesheet cannot reach the Tailwind bundle — so the
	tokens below are restated from DESIGN.md rather than imported. The accent is the
	single source they derive from, exactly as global.css does it, so re-tuning the hue
	re-tunes this page too. Inter cannot follow: its woff2 cuts are hashed build assets,
	so the stack falls through to the brand's declared fallback and picks up a locally
	installed Inter when there is one.
-->
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom"
>
	<xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />

	<xsl:template match="/">
		<!-- The feed's own address, for pasting into a reader. Emitted by each route as
		rel="self"; channel/link is the fallback and points at the site root. -->
		<xsl:variable name="feedUrl">
			<xsl:choose>
				<xsl:when test="/rss/channel/atom:link[@rel='self']/@href">
					<xsl:value-of
						select="/rss/channel/atom:link[@rel='self']/@href"
					/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="/rss/channel/link" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<!-- The page this feed mirrors, so a browser that landed here has a way back in. -->
		<xsl:variable name="pageUrl">
			<xsl:choose>
				<xsl:when test="/rss/channel/atom:link[@rel='alternate']/@href">
					<xsl:value-of
						select="/rss/channel/atom:link[@rel='alternate']/@href"
					/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="/rss/channel/link" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title><xsl:value-of select="/rss/channel/title" /></title>
				<link rel="shortcut icon" href="/img/coffee-icon.png" />
				<style>
					:root {
						--accent: #59b4ff;
						/* Same derivation as global.css: one hue generates the ramp. */
						--primary-500: oklch(from var(--accent) 50% c h);
						--paper: #ffffff;
						--glass: rgb(0 0 0 / 0.3);
						--ring: rgb(255 255 255 / 0.1);
						--sky-highlight: #7dd3fc;
						--sky-meta: #bae6fd;
						--sky-body: #e0f2fe;
					}

					* { box-sizing: border-box; }

					/* The night ground: fixed, never scrolling, never repainted. */
					html {
						background: linear-gradient(to bottom, var(--primary-500), #000000)
							fixed;
						background-repeat: no-repeat;
					}

					body {
						margin: 0;
						padding: 0 1rem 4rem;
						/* 450 on glass: light text on a dark ground reads thinner. */
						font: 450 1rem/1.75 "Inter Variable", Inter, ui-sans-serif,
							system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
						color: var(--sky-body);
					}

					.frame { margin: 0 auto; max-width: 42rem; }

					/* Masthead, page title and description sit on the gradient above any
					surface — the site's one opening move. */
					.masthead { padding: 1.5rem 0 0; }

					.wordmark {
						color: var(--paper);
						font-size: 1.125rem;
						font-weight: 600;
						letter-spacing: -0.025em;
						text-decoration: none;
					}

					h1 {
						margin: 2rem 0 0;
						color: var(--paper);
						font-size: 1.875rem;
						font-weight: 600;
						line-height: 1.2;
						letter-spacing: -0.025em;
						text-shadow: 0 2px 4px rgb(0 0 0 / 0.3);
					}

					.lede {
						margin: 0.5rem 0 0;
						max-width: 34rem;
						color: rgb(224 242 254 / 0.8);
					}

					/* Glass: translucent, blurred, hairline-ringed. Never a drop shadow —
					a shadow does nothing over near-black. */
					.card {
						margin-top: 1.25rem;
						padding: 1.25rem;
						border-radius: 0.75rem;
						background: var(--glass);
						box-shadow: inset 0 0 0 1px var(--ring);
						backdrop-filter: blur(12px);
					}

					.label {
						margin: 0;
						color: var(--sky-meta);
						font-size: 0.875rem;
						font-weight: 600;
						letter-spacing: 0.025em;
						text-transform: uppercase;
					}

					.card p { margin: 0.75rem 0 0; }

					.address {
						display: flex;
						gap: 0.5rem;
						align-items: center;
						margin-top: 0.75rem;
					}

					code {
						flex: 1 1 auto;
						overflow-x: auto;
						padding: 0.375rem 0.625rem;
						border-radius: 0.25rem;
						background: rgb(2 6 23 / 0.6);
						box-shadow: inset 0 0 0 1px var(--ring);
						color: var(--paper);
						font-family: "Source Code Pro Variable", ui-monospace,
							SFMono-Regular, Menlo, monospace;
						font-size: 0.875rem;
						white-space: nowrap;
					}

					button {
						flex: 0 0 auto;
						padding: 0.375rem 0.75rem;
						border: 0;
						border-radius: 0.25rem;
						background: var(--primary-500);
						color: var(--paper);
						font: inherit;
						font-size: 0.875rem;
						cursor: pointer;
						transition: background-color 200ms;
					}

					button:hover { background: oklch(from var(--accent) 40% c h); }

					a { color: var(--sky-highlight); text-decoration: none; }
					a:hover { text-decoration: underline; }

					ol { margin: 0; padding: 0; list-style: none; }

					/* Two lines, as in the rail on /activity: a Bluesky post's whole body
					arrives as its title and would otherwise run a card six lines deep. */
					.entry-title {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						color: var(--paper);
						font-size: 1.125rem;
						font-weight: 500;
						line-height: 1.375;
						transition: color 200ms;
					}

					.entry-title:hover {
						color: var(--sky-highlight);
						text-decoration: none;
					}

					/* Feed metadata: one small line of tabular figures, · separated. */
					.meta {
						margin: 0.375rem 0 0;
						color: var(--sky-meta);
						font-size: 0.6875rem;
						font-variant-numeric: tabular-nums slashed-zero;
					}

					.sep { color: rgb(186 230 253 / 0.4); }

					.summary {
						margin: 0.5rem 0 0;
						color: rgb(224 242 254 / 0.7);
						font-size: 0.875rem;
					}

					.pills {
						display: flex;
						flex-wrap: wrap;
						gap: 0.375rem;
						margin: 0.75rem 0 0;
					}

					/* Pill, dark tone: the signature primitive, lowercase. */
					.pill {
						padding: 0.125rem 0.5rem;
						border: 1px solid rgb(255 255 255 / 0.25);
						border-radius: 0.25rem;
						background: rgb(255 255 255 / 0.1);
						color: var(--sky-body);
						font-size: 0.75rem;
						text-transform: lowercase;
					}

					footer {
						margin-top: 2rem;
						padding-top: 1.5rem;
						border-top: 1px solid var(--ring);
						color: rgb(186 230 253 / 0.6);
						font-size: 0.75rem;
					}

					@media (min-width: 640px) {
						body { padding: 0 1.5rem 4rem; }
						h1 { font-size: 2.25rem; }
					}

					@media (prefers-reduced-motion: reduce) {
						* { transition: none !important; }
					}
				</style>
			</head>

			<body>
				<div class="frame">
					<header class="masthead">
						<a class="wordmark" href="https://andri.dk/">andri.dk</a>
					</header>

					<h1><xsl:value-of select="/rss/channel/title" /></h1>
					<p class="lede">
						<xsl:value-of select="/rss/channel/description" />
					</p>

					<section class="card">
						<h2 class="label">Web feed</h2>
						<p>
							You are looking at the raw feed behind a page. Paste this
							address into a feed reader and new entries arrive on their
							own.
						</p>
						<div class="address">
							<code id="feed-url"><xsl:value-of select="$feedUrl" /></code>
							<button type="button" id="copy">copy</button>
						</div>
						<p>
							<a href="{$pageUrl}">Read it on the site instead</a>
						</p>
					</section>

					<ol>
						<xsl:for-each select="/rss/channel/item">
							<li class="card">
								<a class="entry-title" href="{link}">
									<xsl:value-of select="title" />
								</a>
								<p class="meta">
									<!-- RFC-822 pubDate, trimmed to "15 Aug 2026". -->
									<xsl:value-of select="substring(pubDate, 6, 11)" />
									<xsl:if test="link">
										<span class="sep"> · </span>
										<xsl:value-of
											select="substring-before(concat(substring-after(link, '://'), '/'), '/')"
										/>
									</xsl:if>
								</p>
								<xsl:if test="description">
									<p class="summary">
										<xsl:value-of select="description" />
									</p>
								</xsl:if>
								<xsl:if test="category">
									<p class="pills">
										<xsl:for-each select="category">
											<span class="pill">
												<xsl:value-of select="." />
											</span>
										</xsl:for-each>
									</p>
								</xsl:if>
							</li>
						</xsl:for-each>
					</ol>

					<footer>
						<xsl:value-of select="count(/rss/channel/item)" />
						<xsl:text> entries · </xsl:text>
						<a href="https://andri.dk/">andri.dk</a>
					</footer>
				</div>

				<script><![CDATA[
					document.getElementById("copy").addEventListener("click", function () {
						var url = document.getElementById("feed-url").textContent;
						var button = document.getElementById("copy");
						navigator.clipboard.writeText(url).then(function () {
							button.textContent = "copied";
						});
					});
				]]></script>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
