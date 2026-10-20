import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MermaidDiagram from '../MermaidDiagram';

const mockRender = jest.fn();

jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: (...args: unknown[]) => mockRender(...args),
  },
}));

jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('MermaidDiagram', () => {
  const chart = 'flowchart LR\n  A --> B';

  beforeEach(() => {
    jest.clearAllMocks();
    mockRender.mockResolvedValue({
      svg: '<svg data-testid="mermaid-svg"></svg>',
    });
  });

  it('renders the mermaid diagram', async () => {
    render(<MermaidDiagram chart={chart} />);

    await waitFor(() => {
      expect(screen.getByTestId('mermaid-svg')).toBeInTheDocument();
    });
  });

  it('shows source code when toggled', async () => {
    render(<MermaidDiagram chart={chart} />);

    fireEvent.click(screen.getByRole('button', { name: /view source/i }));

    const sourcePanel = screen
      .getByRole('figure', {
        name: 'Mermaid diagram',
      })
      .querySelector('pre code');

    expect(sourcePanel).toHaveTextContent('flowchart LR');
    expect(sourcePanel).toHaveTextContent('A --> B');
    expect(
      screen.getByRole('button', { name: /hide source/i })
    ).toBeInTheDocument();
  });

  it('copies mermaid source to clipboard', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<MermaidDiagram chart={chart} />);

    fireEvent.click(screen.getByRole('button', { name: /copy mermaid/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(chart);
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('opens the diagram in full screen', async () => {
    render(<MermaidDiagram chart={chart} />);

    await waitFor(() => {
      expect(screen.getByTestId('mermaid-svg')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /full screen/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Architecture diagram')).toBeInTheDocument();
    expect(screen.getAllByTestId('mermaid-svg')).toHaveLength(2);
  });

  it('shows an error when rendering fails', async () => {
    mockRender.mockRejectedValueOnce(new Error('Invalid syntax'));

    render(<MermaidDiagram chart={chart} />);

    await waitFor(() => {
      expect(screen.getByText('Invalid syntax')).toBeInTheDocument();
    });
  });
});
