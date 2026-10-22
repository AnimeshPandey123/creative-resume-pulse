import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarkdownPartRenderer } from '../MarkdownPartRenderer';

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

jest.mock('../MermaidDiagram', () => {
  return function MockMermaidDiagram({ chart }: { chart: string }) {
    return <div data-testid="mermaid-diagram">{chart}</div>;
  };
});

jest.mock('../CodeBlock', () => {
  return function MockCodeBlock({ children }: { children: React.ReactNode }) {
    return <pre>{children}</pre>;
  };
});

describe('MarkdownPartRenderer', () => {
  it('renders markdown content', () => {
    render(
      <MarkdownPartRenderer
        part={{ type: 'markdown', content: 'Hello **world**' }}
      />
    );
    expect(screen.getByTestId('markdown-content')).toHaveTextContent(
      'Hello **world**'
    );
  });

  it('renders mermaid blocks', () => {
    render(
      <MarkdownPartRenderer
        part={{ type: 'mermaid', content: 'flowchart LR\n  A --> B' }}
      />
    );

    expect(screen.getByTestId('mermaid-diagram')).toHaveTextContent(
      'flowchart LR'
    );
  });
});
