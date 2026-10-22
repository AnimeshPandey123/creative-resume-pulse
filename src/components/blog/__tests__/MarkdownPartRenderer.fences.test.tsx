import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarkdownPartRenderer } from '../MarkdownPartRenderer';

jest.mock('../MermaidDiagram', () => {
  return function MockMermaidDiagram({ chart }: { chart: string }) {
    return <div data-testid="mermaid-diagram">{chart}</div>;
  };
});

// react-markdown is ESM-only, so dispatch fences through the real components.
jest.mock('react-markdown', () => {
  const React = require('react');

  function renderInline(
    text: string,
    components: {
      code: React.ComponentType<{
        className?: string;
        children?: React.ReactNode;
      }>;
    },
    key: number
  ) {
    const parts: React.ReactNode[] = [];
    const pattern = /`([^`]+)`/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = pattern.exec(text))) {
      if (match.index > last) {
        parts.push(text.slice(last, match.index));
      }
      parts.push(
        React.createElement(
          components.code,
          { key: `${key}-code-${index}` },
          match[1]
        )
      );
      last = match.index + match[0].length;
      index += 1;
    }

    if (last < text.length) {
      parts.push(text.slice(last));
    }

    return React.createElement('span', { key }, parts);
  }

  return function MockReactMarkdown({
    children,
    components,
  }: {
    children: string;
    components: {
      pre: React.ComponentType<{ children?: React.ReactNode }>;
      code: React.ComponentType<{
        className?: string;
        children?: React.ReactNode;
      }>;
    };
  }) {
    const text = String(children);
    const nodes: React.ReactNode[] = [];
    const fence = /```([^\n]*)\n([\s\S]*?)```/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = fence.exec(text))) {
      if (match.index > last) {
        nodes.push(
          renderInline(text.slice(last, match.index), components, key)
        );
        key += 1;
      }

      const language = match[1].trim();
      const code = React.createElement(
        components.code,
        { className: language ? `language-${language}` : undefined },
        match[2]
      );
      nodes.push(React.createElement(components.pre, { key }, code));
      key += 1;
      last = match.index + match[0].length;
    }

    if (last < text.length) {
      nodes.push(renderInline(text.slice(last), components, key));
    }

    return React.createElement('div', null, nodes);
  };
});

describe('MarkdownPartRenderer fenced blocks', () => {
  it('keeps a pre wrapper around unlabeled fences so line breaks remain', () => {
    const { container } = render(
      <MarkdownPartRenderer
        part={{
          type: 'markdown',
          content: [
            '```',
            'GET /jsonapi/node/article',
            'GET /jsonapi/node/article/{uuid}',
            '```',
          ].join('\n'),
        }}
      />
    );

    const code = container.querySelector('pre code');
    expect(code).not.toBeNull();
    expect(code?.textContent).toContain(
      'GET /jsonapi/node/article\nGET /jsonapi/node/article/{uuid}'
    );
    expect(
      screen.queryByRole('button', { name: /copy/i })
    ).not.toBeInTheDocument();
  });

  it('renders a language fence as a CodeBlock instead of wrapping it in pre', () => {
    const { container } = render(
      <MarkdownPartRenderer
        part={{
          type: 'markdown',
          content: ['```javascript', 'const n = 1;', '```'].join('\n'),
        }}
      />
    );

    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(container.querySelector('pre')).toBeNull();
  });

  it('renders inline code without a pre wrapper', () => {
    const { container } = render(
      <MarkdownPartRenderer
        part={{ type: 'markdown', content: 'Use `inline` code.' }}
      />
    );

    expect(container.querySelector('pre')).toBeNull();
    expect(container.querySelector('code')).toHaveTextContent('inline');
  });

  it('keeps line breaks in an unlabeled ignore-file fence', () => {
    const { container } = render(
      <MarkdownPartRenderer
        part={{
          type: 'markdown',
          content: ['```', '__pycache__', '*.pyc', '.env', '```'].join('\n'),
        }}
      />
    );

    const code = container.querySelector('pre code');
    expect(code?.textContent).toBe('__pycache__\n*.pyc\n.env\n');
  });
});
