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
    render(<CodeBlock language={mockLanguage}>{mockCode}</CodeBlock>);

    expect(screen.getByText(mockCode)).toBeInTheDocument();
  });

  it('shows copy button in toolbar', () => {
    render(<CodeBlock language={mockLanguage}>{mockCode}</CodeBlock>);

    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CodeBlock language={mockLanguage}>{mockCode}</CodeBlock>);

    fireEvent.click(screen.getByText('Copy'));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockCode);
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('shows copied state for 2 seconds', async () => {
    jest.useFakeTimers();

    render(<CodeBlock language={mockLanguage}>{mockCode}</CodeBlock>);

    fireEvent.click(screen.getByText('Copy'));

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('handles clipboard write errors gracefully', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockWriteText = jest
      .fn()
      .mockRejectedValue(new Error('Clipboard access denied'));

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CodeBlock language={mockLanguage}>{mockCode}</CodeBlock>);

    fireEvent.click(screen.getByText('Copy'));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockCode);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to copy code:',
        expect.any(Error)
      );
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
