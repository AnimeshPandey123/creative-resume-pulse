'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  language: string;
  children: string;
  className?: string;
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  children,
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative my-4 not-prose rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2 bg-background hover:bg-muted text-foreground border border-border shadow-sm"
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 shrink-0" />
          )}
          <span className="ml-1.5 text-xs w-[5.5rem] text-left">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </Button>
      </div>

      <SyntaxHighlighter
        // @ts-ignore - Working around type issues with react-syntax-highlighter
        style={atomDark}
        language={language}
        PreTag="div"
        className={`!mt-0 !mb-0 !rounded-none ${className || ''}`}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
