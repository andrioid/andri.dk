export type CodeSnippet = {
  lang: string;
  code: string;
};

export function codesnippetFromMarkdown(md: string): CodeSnippet | null {
  if (!md) return null;
  // Find the ```<lang>\n<code>``` from string
  const match = md.match(/```(\w+)\n([\s\S]*?)```/);
  if (!match) return null;
  return {
    lang: match[1],
    code: match[2],
  };
}
