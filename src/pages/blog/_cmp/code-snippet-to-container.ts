import { container, ContainerNode, text } from "@takumi-rs/helpers";
import { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";

const DEFAULT_FONT_SIZE = 32;
const DEFAULT_LINE_HEIGHT = 1.3;

export function codesnippetToImageContainer({
  code,
  lang,
  theme = "github-dark",
  highlighter,
}: {
  code: string;
  lang: BundledLanguage;
  theme?: string;
  highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>;
}): ContainerNode {
  const { tokens, fg, bg } = highlighter.codeToTokens(code, {
    theme: theme,
    lang: lang,
  });

  const codeContainer = container({
    style: {
      color: fg,
      backgroundColor: bg,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: DEFAULT_LINE_HEIGHT,
      fontFamily: "monospace",
      whiteSpace: "pre",
      overflowWrap: "anywhere",
      flexGrow: 1,
      flexBasis: 0,
      flexWrap: "wrap", // we only have room for one row, but we dont want to show it
      textOverflow: "ellipsis",
      minWidth: 0,
      minHeight: 0,
      rowGap: "10em",
      borderRadius: "1rem",
      padding: "2rem",
      border: "0.1rem solid rgba(255,255,255,0.2)",
    },
    children: tokens.map((line) =>
      container({
        style: {
          display: "block",
          minHeight: "1em",
          width: "100%",
        },
        children: line.map((token) =>
          text(token.content, { color: token.color, display: "inline" }),
        ),
      }),
    ),
  });

  const root = container({
    style: {
      color: fg,
      backgroundColor: bg,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: "2rem",
      backgroundImage: "linear-gradient(to bottom, #033359ff, black)",
    },
    children: [codeContainer],
  });

  return root;
}
