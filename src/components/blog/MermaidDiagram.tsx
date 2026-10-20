'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTheme } from '@/components/ThemeProvider';

interface MermaidDiagramProps {
  chart: string;
}

const diagramSvgClassName =
  'mermaid-diagram font-sans [&_svg]:block [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto';

function normalizeMermaidSvg(svg: string): string {
  return svg.replace(
    /<svg([^>]*)>/,
    (_match, attrs: string) =>
      `<svg${attrs} style="max-width:100%;height:auto;display:block;">`
  );
}

function DiagramSvg({ svg }: { svg: string }) {
  return (
    <div
      className={diagramSvgClassName}
      dangerouslySetInnerHTML={{ __html: normalizeMermaidSvg(svg) }}
    />
  );
}

function CopyButton({
  copied,
  onCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
}: {
  copied: boolean;
  onCopy: () => void;
  label?: string;
  copiedLabel?: string;
}) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onCopy}
      className="h-8 px-2 bg-background hover:bg-muted text-foreground border border-border shadow-sm"
    >
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 shrink-0" />
      )}
      <span className="ml-1.5 text-xs w-[5.5rem] text-left">
        {copied ? copiedLabel : label}
      </span>
    </Button>
  );
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const hasRenderedRef = useRef(false);
  const diagramId = useId().replace(/:/g, '');
  const { theme } = useTheme();
  const source = chart.trim();

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      if (!hasRenderedRef.current) {
        setIsRendering(true);
      }
      setError(null);

      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            padding: 12,
            nodeSpacing: 30,
            rankSpacing: 40,
          },
        });

        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${diagramId}-${theme}`,
          source
        );

        if (!cancelled) {
          setSvg(renderedSvg);
          hasRenderedRef.current = true;
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram'
          );
          setSvg('');
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagramId, source, theme]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Mermaid source:', err);
    }
  };

  const toolbarButtonClass =
    'h-8 px-2 bg-background hover:bg-muted text-foreground border border-border shadow-sm';

  return (
    <>
      <figure
        className="relative my-6 rounded-lg border border-border bg-muted/30 overflow-hidden not-prose font-sans"
        aria-label="Mermaid diagram"
      >
        <div className="flex flex-wrap items-center justify-end gap-2 border-b border-border bg-muted/40 px-3 py-2">
          {!error && svg && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className={toolbarButtonClass}
            >
              <Maximize2 className="h-4 w-4 shrink-0" />
              <span className="ml-1.5 text-xs">Full screen</span>
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSource(prev => !prev)}
            className={toolbarButtonClass}
            aria-expanded={showSource}
            aria-controls={`mermaid-source-${diagramId}`}
          >
            {showSource ? (
              <ChevronUp className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-1.5 text-xs">
              {showSource ? 'Hide source' : 'View source'}
            </span>
          </Button>
          <CopyButton
            copied={copied}
            onCopy={handleCopy}
            label="Copy Mermaid"
            copiedLabel="Copied!"
          />
        </div>

        <div className="p-4 overflow-x-auto flex justify-center min-h-[200px]">
          {isRendering && !svg && !error && (
            <p className="text-sm text-muted-foreground self-center">
              Rendering diagram...
            </p>
          )}

          {error && (
            <pre className="w-full text-sm text-destructive whitespace-pre-wrap">
              {error}
            </pre>
          )}

          {svg && !error && <DiagramSvg svg={svg} />}
        </div>

        {showSource && (
          <pre
            id={`mermaid-source-${diagramId}`}
            className="border-t border-border p-4 text-sm overflow-x-auto bg-muted/50 text-foreground m-0"
          >
            <code>{source}</code>
          </pre>
        )}
      </figure>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-auto p-6">
          <DialogHeader>
            <DialogTitle>Architecture diagram</DialogTitle>
            <DialogDescription className="sr-only">
              Full-screen view of the Mermaid architecture diagram. Press Escape
              to close.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto flex justify-center py-2">
            {svg && <DiagramSvg svg={svg} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MermaidDiagram;
