"use client";

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

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, className, ...props }) => {
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
        <div className="relative group">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2 bg-gray-800/80 hover:bg-gray-700/80 text-white border-gray-600"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-1 text-xs">
                        {copied ? 'Copied!' : 'Copy'}
                    </span>
                </Button>
            </div>

            <SyntaxHighlighter
                // @ts-ignore - Working around type issues with react-syntax-highlighter
                style={atomDark}
                language={language}
                PreTag="div"
                className={`rounded-md ${className || ''}`}
                {...props}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
