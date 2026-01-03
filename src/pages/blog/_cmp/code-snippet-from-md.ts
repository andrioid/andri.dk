export type CodeSnippet = {
  lang: string;
  code: string;
};

export function codesnippetFromMarkdown(md: string): Array<CodeSnippet> | null {
  // Find the ```<lang>\n<code>``` from string
  const match = md.matchAll(/```(\w+?)\n([\s\S]*?)```/g);
  if (match === null) {
    return null;
  }
  let snippets: Array<CodeSnippet> = [];
  for (const m of match) {
    snippets.push({
      lang: m[1],
      code: m[2],
    });
  }
  return snippets;
}
