'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dependencies interface for better testability
interface ThemeDependencies {
  localStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  };
  matchMedia: (query: string) => {
    matches: boolean;
    media: string;
    addEventListener: (event: string, handler: () => void) => void;
    removeEventListener: (event: string, handler: () => void) => void;
  };
  document: {
    documentElement: {
      classList: {
        remove: (...classes: string[]) => void;
        add: (className: string) => void;
      };
    };
  };
}

// Default dependencies (browser environment)
const defaultDependencies: ThemeDependencies = {
  localStorage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
  },
  matchMedia: (query: string) => window.matchMedia(query),
  document: {
    documentElement: {
      classList: {
        remove: (...classes: string[]) =>
          document.documentElement.classList.remove(...classes),
        add: (className: string) =>
          document.documentElement.classList.add(className),
      },
    },
  },
};

// Extracted theme logic for better testability
export const createThemeHandler = (
  dependencies: ThemeDependencies = defaultDependencies
) => {
  const getSystemTheme = (): Theme => {
    const mediaQuery = dependencies.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  };

  const getStoredTheme = (): Theme | null => {
    return dependencies.localStorage.getItem('theme') as Theme | null;
  };

  const initializeTheme = (): Theme => {
    const storedTheme = getStoredTheme();
    if (!storedTheme) {
      return getSystemTheme();
    }
    return storedTheme;
  };

  const createSystemThemeChangeHandler = (
    mediaQuery: { matches: boolean; media: string },
    setTheme: (theme: Theme) => void
  ) => {
    return () => {
      // Only change if user hasn't set a preference
      if (!dependencies.localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
  };

  const applyThemeToDocument = (theme: Theme) => {
    const { documentElement } = dependencies.document;
    documentElement.classList.remove('light', 'dark');
    documentElement.classList.add(theme);
  };

  const storeTheme = (theme: Theme) => {
    dependencies.localStorage.setItem('theme', theme);
  };

  return {
    getSystemTheme,
    getStoredTheme,
    initializeTheme,
    createSystemThemeChangeHandler,
    applyThemeToDocument,
    storeTheme,
  };
};

export function ThemeProvider({
  children,
  dependencies = defaultDependencies,
}: {
  children: React.ReactNode;
  dependencies?: ThemeDependencies;
}) {
  const [theme, setTheme] = useState<Theme>('light'); // Safe default for SSR
  const themeHandler = useMemo(
    () => createThemeHandler(dependencies),
    [dependencies]
  );

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const initialTheme = themeHandler.initializeTheme();
    setTheme(initialTheme);
  }, [themeHandler]);

  // Update the document class when the theme changes
  useEffect(() => {
    themeHandler.applyThemeToDocument(theme);
    themeHandler.storeTheme(theme);
  }, [theme, themeHandler]);

  // Monitor system theme changes
  useEffect(() => {
    const mediaQuery = dependencies.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = themeHandler.createSystemThemeChangeHandler(
      mediaQuery,
      setTheme
    );

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dependencies, themeHandler]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
