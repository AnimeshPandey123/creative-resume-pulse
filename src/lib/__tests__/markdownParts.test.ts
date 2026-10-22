import { splitMarkdownParts } from '../markdownParts';

describe('splitMarkdownParts', () => {
  it('returns a single markdown part for content without mermaid', () => {
    expect(splitMarkdownParts('Hello **world**')).toEqual([
      { type: 'markdown', content: 'Hello **world**' },
    ]);
  });

  it('splits mermaid blocks from surrounding markdown', () => {
    const content = [
      '## Intro',
      '',
      '```mermaid',
      'flowchart LR',
      '  A --> B',
      '```',
      '',
      '## After',
    ].join('\n');

    expect(splitMarkdownParts(content)).toEqual([
      { type: 'markdown', content: '## Intro\n\n' },
      { type: 'mermaid', content: 'flowchart LR\n  A --> B' },
      { type: 'markdown', content: '\n\n## After' },
    ]);
  });

  it('handles empty content', () => {
    expect(splitMarkdownParts('')).toEqual([{ type: 'markdown', content: '' }]);
  });
});
