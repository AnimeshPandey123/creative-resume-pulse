'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MarkdownPart } from '@/lib/markdownParts';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';

interface CodeProps {
  className?: string;
  children: React.ReactNode;
  node?: unknown;
  [key: string]: unknown;
}

interface MarkdownPartRendererProps {
  part: MarkdownPart;
}

const remarkPlugins = [remarkGfm];

function isHighlightedFence(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) {
    return false;
  }

  if (child.type === CodeBlock) {
    return true;
  }

  // react-markdown passes the <code> element through, not the rendered
  // CodeBlock. A language class is what that code element turns into.
  const className = (child.props as { className?: unknown }).className;
  return typeof className === 'string' && /language-(\w+)/.test(className);
}

const markdownComponents = {
  // Language fences become a CodeBlock, which already has its own chrome.
  // Any other fenced block keeps <pre> so prose does not collapse its lines.
  pre: ({
    children,
    node: _node,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { node?: unknown }) => {
    const elementChildren = React.Children.toArray(children).filter(child =>
      React.isValidElement(child)
    );
    const onlyHighlightedFences =
      elementChildren.length > 0 && elementChildren.every(isHighlightedFence);

    if (onlyHighlightedFences) {
      return <>{children}</>;
    }

    return <pre {...props}>{children}</pre>;
  },
  table: ({
    children,
    node: _node,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement> & { node?: unknown }) => (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full min-w-[640px] border-collapse text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    node: _node,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement> & { node?: unknown }) => (
    <thead className="border-b border-border bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  th: ({
    children,
    node: _node,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
    <th
      className="px-4 py-3 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({
    children,
    node: _node,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
    <td
      className="border-t border-border px-4 py-3 align-top text-muted-foreground"
      {...props}
    >
      {children}
    </td>
  ),
  code: ({ className, children, node: _node, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1];
    const code = String(children).replace(/\n$/, '');

    if (language) {
      return (
        <CodeBlock language={language} className={className} {...props}>
          {code}
        </CodeBlock>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a: ({
    href,
    children,
    node: _node,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
};

export function MarkdownPartRenderer({ part }: MarkdownPartRendererProps) {
  if (part.type === 'mermaid') {
    return (
      <MarkdownErrorBoundary
        fallback={
          <figure className="my-6 rounded-lg border border-border bg-muted/30 p-4 not-prose">
            <p className="mb-2 text-sm text-destructive">
              Diagram failed to render.
            </p>
            <pre className="overflow-x-auto text-sm">
              <code>{part.content}</code>
            </pre>
          </figure>
        }
      >
        <MermaidDiagram chart={part.content} />
      </MarkdownErrorBoundary>
    );
  }

  if (!part.content.trim()) {
    return null;
  }

  return (
    <MarkdownErrorBoundary
      fallback={
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-sm">
          {part.content}
        </pre>
      }
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={markdownComponents}
      >
        {part.content}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  );
}
