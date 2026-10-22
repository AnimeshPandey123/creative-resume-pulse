import { readFileSync } from 'fs';
import path from 'path';
import { readFrontmatter } from '@/lib/frontmatter';

describe('readFrontmatter', () => {
  it('returns the body unchanged when a post has no frontmatter', () => {
    expect(readFrontmatter('# Hello\n')).toEqual({
      content: '# Hello\n',
      data: {},
    });
  });

  it('reads quoted fields and a multiline tag list', () => {
    const raw = `---
title: 'Designing a Hybrid RAG Architecture for Academic Research'
excerpt: "A two-stage architecture"
publishDate: '2026-06-12'
tags:
  [
    'python',
    'machine-learning-ai',
  ]
---

# Body
`;

    expect(readFrontmatter(raw)).toEqual({
      content: '\n# Body\n',
      data: {
        title: 'Designing a Hybrid RAG Architecture for Academic Research',
        excerpt: 'A two-stage architecture',
        publishDate: '2026-06-12',
        tags: ['python', 'machine-learning-ai'],
      },
    });
  });

  it('reads unquoted tag lists', () => {
    const raw = `---
title: 'Flask'
tags: [python, flask, docker]
---
body
`;

    expect(readFrontmatter(raw).data.tags).toEqual([
      'python',
      'flask',
      'docker',
    ]);
  });

  it('ignores frontmatter that is not a mapping', () => {
    expect(readFrontmatter('---\n- just\n- a\n- list\n---\nbody\n')).toEqual({
      content: 'body\n',
      data: {},
    });
  });

  it('reads a published post', () => {
    const raw = readFileSync(
      path.join(
        process.cwd(),
        'src/content/blog/getting-started-with-react-hooks.md'
      ),
      'utf8'
    );
    const { data, content } = readFrontmatter(raw);

    expect(data.title).toBe('Getting Started with React Hooks');
    expect(data.publishDate).toBe('2025-09-04');
    expect(data.tags).toContain('react');
    expect(content).toContain('# Getting started with React Hooks');
  });
});
