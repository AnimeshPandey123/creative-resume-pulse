import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import {
  ThemeProvider,
  useTheme,
  createThemeHandler,
} from '@/components/ThemeProvider';

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

  it('preserves stored dark theme after remount', () => {
    localStorage.setItem('theme', 'dark');

    const first = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(first.getByTestId('theme').textContent).toBe('dark');

    first.unmount();

    const second = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(second.getByTestId('theme').textContent).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
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

  it('toggles theme from dark to light', () => {
    // Start with dark theme
    localStorage.setItem('theme', 'dark');

    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    // Should start with dark theme
    expect(getByTestId('theme').textContent).toBe('dark');

    // Toggle to light
    fireEvent.click(getByText('toggle'));
    expect(getByTestId('theme').textContent).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
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

  it('should handle system theme change to dark when no user preference', () => {
    // Set up mock to return dark theme
    const mockMediaQueryDark = {
      matches: true, // Dark theme
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(q => ({
      ...mockMediaQueryDark,
      matches: q.includes('dark') ? true : false,
      media: q,
    })) as any;

    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    // Should initialize with dark theme
    expect(getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should not change theme when system preference changes but user has stored preference', () => {
    // Set user preference to light
    localStorage.setItem('theme', 'light');

    // Start with dark system theme
    const mockMediaQueryDark = {
      matches: true, // Dark theme
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(q => ({
      ...mockMediaQueryDark,
      matches: q.includes('dark') ? true : false,
      media: q,
    })) as any;

    const { getByTestId } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    // Should start with light theme (user preference)
    expect(getByTestId('theme')).toHaveTextContent('light');

    // Simulate system theme change to light (different from user preference)
    act(() => {
      // Update the mock to return light theme
      window.matchMedia = jest.fn().mockImplementation(q => ({
        ...mockMediaQueryDark,
        matches: q.includes('dark') ? false : true,
        media: q,
      })) as any;

      // Find and call the change handler
      const changeHandler = mockMediaQueryDark.addEventListener.mock.calls.find(
        (call: any) => call[0] === 'change'
      )?.[1];
      if (changeHandler) {
        changeHandler();
      }
    });

    // Should still be light theme (user preference should be preserved)
    expect(getByTestId('theme')).toHaveTextContent('light');
  });
});

describe('createThemeHandler', () => {
  let mockDependencies: any;

  beforeEach(() => {
    mockDependencies = {
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      matchMedia: jest.fn(),
      document: {
        documentElement: {
          classList: {
            remove: jest.fn(),
            add: jest.fn(),
          },
        },
      },
    };
  });

  describe('getSystemTheme', () => {
    it('returns dark when system prefers dark theme', () => {
      mockDependencies.matchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      });

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.getSystemTheme();

      expect(result).toBe('dark');
      expect(mockDependencies.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)'
      );
    });

    it('returns light when system prefers light theme', () => {
      mockDependencies.matchMedia.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
      });

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.getSystemTheme();

      expect(result).toBe('light');
      expect(mockDependencies.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)'
      );
    });
  });

  describe('getStoredTheme', () => {
    it('returns stored theme when available', () => {
      mockDependencies.localStorage.getItem.mockReturnValue('dark');

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.getStoredTheme();

      expect(result).toBe('dark');
      expect(mockDependencies.localStorage.getItem).toHaveBeenCalledWith(
        'theme'
      );
    });

    it('returns null when no theme is stored', () => {
      mockDependencies.localStorage.getItem.mockReturnValue(null);

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.getStoredTheme();

      expect(result).toBe(null);
      expect(mockDependencies.localStorage.getItem).toHaveBeenCalledWith(
        'theme'
      );
    });
  });

  describe('initializeTheme', () => {
    it('returns stored theme when available', () => {
      mockDependencies.localStorage.getItem.mockReturnValue('dark');

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.initializeTheme();

      expect(result).toBe('dark');
    });

    it('returns system theme when no stored theme', () => {
      mockDependencies.localStorage.getItem.mockReturnValue(null);
      mockDependencies.matchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      });

      const themeHandler = createThemeHandler(mockDependencies);
      const result = themeHandler.initializeTheme();

      expect(result).toBe('dark');
    });
  });

  describe('createSystemThemeChangeHandler', () => {
    it('changes theme when no user preference is stored', () => {
      mockDependencies.localStorage.getItem.mockReturnValue(null);

      const mockMediaQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
      };

      const setTheme = jest.fn();
      const themeHandler = createThemeHandler(mockDependencies);
      const handler = themeHandler.createSystemThemeChangeHandler(
        mockMediaQuery,
        setTheme
      );

      handler();

      expect(setTheme).toHaveBeenCalledWith('dark');
    });

    it('does not change theme when user preference is stored', () => {
      mockDependencies.localStorage.getItem.mockReturnValue('light');

      const mockMediaQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
      };

      const setTheme = jest.fn();
      const themeHandler = createThemeHandler(mockDependencies);
      const handler = themeHandler.createSystemThemeChangeHandler(
        mockMediaQuery,
        setTheme
      );

      handler();

      expect(setTheme).not.toHaveBeenCalled();
    });

    it('changes to light theme when system changes to light and no user preference', () => {
      mockDependencies.localStorage.getItem.mockReturnValue(null);

      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
      };

      const setTheme = jest.fn();
      const themeHandler = createThemeHandler(mockDependencies);
      const handler = themeHandler.createSystemThemeChangeHandler(
        mockMediaQuery,
        setTheme
      );

      handler();

      expect(setTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('applyThemeToDocument', () => {
    it('applies theme classes to document', () => {
      const themeHandler = createThemeHandler(mockDependencies);

      themeHandler.applyThemeToDocument('dark');

      expect(
        mockDependencies.document.documentElement.classList.remove
      ).toHaveBeenCalledWith('light', 'dark');
      expect(
        mockDependencies.document.documentElement.classList.add
      ).toHaveBeenCalledWith('dark');
    });
  });

  describe('storeTheme', () => {
    it('stores theme in localStorage', () => {
      const themeHandler = createThemeHandler(mockDependencies);

      themeHandler.storeTheme('dark');

      expect(mockDependencies.localStorage.setItem).toHaveBeenCalledWith(
        'theme',
        'dark'
      );
    });
  });
});
