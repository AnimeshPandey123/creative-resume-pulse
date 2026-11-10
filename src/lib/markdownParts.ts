export type MarkdownPart =
  | { type: 'markdown'; content: string }
  | { type: 'mermaid'; content: string };

const MERMAID_BLOCK_PATTERN = /```mermaid\n([\s\S]*?)```/g;

export function splitMarkdownParts(content: string): MarkdownPart[] {
  if (!content) {
    return [{ type: 'markdown', content: '' }];
  }

  const parts: MarkdownPart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MERMAID_BLOCK_PATTERN)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.slice(lastIndex, matchIndex),
      });
    }

    parts.push({
      type: 'mermaid',
      content: match[1]?.trim() ?? '',
    });

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.slice(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: 'markdown', content }];
}
