import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodeBlock from '../CodeBlock';

// Mock the clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe('CodeBlock', () => {
    const mockCode = 'console.log("Hello, World!");';
    const mockLanguage = 'javascript';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders code block with language', () => {
        render(
            <CodeBlock language={mockLanguage}>
                {mockCode}
            </CodeBlock>
        );

        expect(screen.getByText(mockCode)).toBeInTheDocument();
    });

    it('shows copy button on hover', () => {
        render(
            <CodeBlock language={mockLanguage}>
                {mockCode}
            </CodeBlock>
        );

        const codeBlock = screen.getByText(mockCode).closest('div');
        if (codeBlock) {
            fireEvent.mouseEnter(codeBlock);
            expect(screen.getByText('Copy')).toBeInTheDocument();
        }
    });

    it('copies code to clipboard when copy button is clicked', async () => {
        const mockWriteText = jest.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: mockWriteText,
            },
        });

        render(
            <CodeBlock language={mockLanguage}>
                {mockCode}
            </CodeBlock>
        );

        const codeBlock = screen.getByText(mockCode).closest('div');
        if (codeBlock) {
            fireEvent.mouseEnter(codeBlock);
            const copyButton = screen.getByText('Copy');
            fireEvent.click(copyButton);

            await waitFor(() => {
                expect(mockWriteText).toHaveBeenCalledWith(mockCode);
                expect(screen.getByText('Copied!')).toBeInTheDocument();
            });
        }
    });

    it('shows copied state for 2 seconds', async () => {
        jest.useFakeTimers();

        render(
            <CodeBlock language={mockLanguage}>
                {mockCode}
            </CodeBlock>
        );

        const codeBlock = screen.getByText(mockCode).closest('div');
        if (codeBlock) {
            fireEvent.mouseEnter(codeBlock);
            const copyButton = screen.getByText('Copy');
            fireEvent.click(copyButton);

            await waitFor(() => {
                expect(screen.getByText('Copied!')).toBeInTheDocument();
            });

            // Fast-forward time
            jest.advanceTimersByTime(2000);

            await waitFor(() => {
                expect(screen.getByText('Copy')).toBeInTheDocument();
            });
        }

        jest.useRealTimers();
    });
});
