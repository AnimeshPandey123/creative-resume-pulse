import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

function TestConsumerWithoutProvider() {
  useTheme();
  return <div>Should not render</div>;
}

describe('ThemeProvider', () => {
  let mockMediaQuery: any;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';

    mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    // mock prefers-color-scheme to light by default
    window.matchMedia = jest.fn().mockImplementation(q => ({
      ...mockMediaQuery,
      matches: q.includes('dark') ? false : true,
      media: q,
    })) as any;
  });

  it('initializes theme from system preference when no stored preference', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('initializes theme from system preference as dark when no stored preference', () => {
    // Mock system preference as dark
    window.matchMedia = jest.fn().mockImplementation(q => ({
      ...mockMediaQuery,
      matches: q.includes('dark') ? true : false,
      media: q,
    })) as any;

    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses stored theme preference when available', () => {
    localStorage.setItem('theme', 'dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme and persists to localStorage', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    fireEvent.click(getByText('toggle'));
    expect(getByTestId('theme').textContent).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not change theme on system change when user has stored preference', () => {
    localStorage.setItem('theme', 'light');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    // Simulate system theme change to dark
    act(() => {
      mockMediaQuery.matches = true;
      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call: any) => call[0] === 'change'
      )?.[1];
      if (changeHandler) {
        changeHandler();
      }
    });

    // Should still be light because user has stored preference
    expect(getByTestId('theme').textContent).toBe('light');
  });

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestConsumerWithoutProvider />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    unmount();

    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
