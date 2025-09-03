<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:atom="http://www.w3.org/2005/Atom">

    <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />

    <!-- Root template -->
    <xsl:template match="/">
        <!-- Prefer the Atom self link if present, else fall back to channel/link -->
    <xsl:variable name="feed_url">
            <xsl:choose>
                <xsl:when test="/rss/channel/atom:link[@rel='self']/@href">
                    <xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href" />
                </xsl:when>
                <xsl:when test="/rss/channel/atom:link/@href">
                    <xsl:value-of select="/rss/channel/atom:link/@href" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="/rss/channel/link" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

    <html
            lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <!-- Do not leak referrers to external sites -->
                <meta name="referrer" content="no-referrer" />
                <title>
                    <xsl:value-of select="/rss/channel/title" />
                </title>
                <style>
                    /* Minimal, self-contained styles (no external resources) */
                    :root { --fg:#111; --muted:#666; --bg:#fff; --card:#f6f7f9; --border:#e5e7eb;
        --accent:#2563eb; }
                    *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg);color:var(--fg);font:16px/1.55
        system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica,Arial,sans-serif}
        header{padding:1.25rem 1rem;border-bottom:1px solid
        var(--border);background:#fff;position:sticky;top:0}
                    h1{margin:0;font-size:1.25rem}
                    main{max-width:800px;margin:0 auto;padding:1rem}
        .desc{color:var(--muted);margin:.25rem 0 1rem}
        .feed-box{display:flex;gap:.5rem;align-items:center;background:var(--card);border:1px solid
        var(--border);padding:.75rem;border-radius:.75rem;overflow:auto}
        code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
        button{border:1px solid var(--border);background:#fff;border-radius:.5rem;padding:.5rem
        .75rem;cursor:pointer}
                    button:hover{border-color:#cfd4dc}
                    a{color:var(--accent);text-decoration:none}
                    a:hover{text-decoration:underline}
                    details{background:#fff;border:1px solid
        var(--border);border-radius:.75rem;margin:.5rem 0}
                    summary{padding:.75rem 1rem;cursor:pointer;font-weight:600}
                    .item{padding:.75rem 1rem;border-top:1px solid var(--border)}
        .meta{color:var(--muted);font-size:.9rem;margin-left:.5rem}
        footer{color:var(--muted);font-size:.875rem;margin-top:1.5rem}
                </style>
            </head>
            <body>
                <header>
                    <h1>
                        <xsl:value-of select="/rss/channel/title" />
                    </h1>
                    <div class="desc">
                        <xsl:value-of select="/rss/channel/description" />
                    </div>
                </header>

                <main>
                    <section aria-label="Items">
                        <xsl:for-each select="/rss/channel/item">
                            <details>
                                <summary>
                                    <a rel="noreferrer noopener" target="_blank">
                                        <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                                        <xsl:value-of select="title" />
                                    </a>
                                    <span class="meta">
                                        <xsl:text> — </xsl:text>
                                        <xsl:value-of select="pubDate" />
                                    </span>
                                </summary>
                                <div class="item">
                                    <!-- If descriptions contain HTML, allow it through. -->
                                    <xsl:value-of select="description" disable-output-escaping="yes" />
                                </div>
                            </details>
                        </xsl:for-each>
                        <footer>
                            <xsl:value-of select="count(/rss/channel/item)" /> item(s). </footer>
                    </section>
                </main>

            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>