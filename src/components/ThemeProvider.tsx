'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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
    getItem: (key: string) =>
      typeof window !== 'undefined' ? localStorage.getItem(key) : null,
    setItem: (key: string, value: string) =>
      typeof window !== 'undefined'
        ? localStorage.setItem(key, value)
        : undefined,
  },
  matchMedia: (query: string) =>
    typeof window !== 'undefined'
      ? window.matchMedia(query)
      : {
          matches: false,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        },
  document: {
    documentElement: {
      classList: {
        remove: (...classes: string[]) =>
          typeof document !== 'undefined'
            ? document.documentElement.classList.remove(...classes)
            : undefined,
        add: (className: string) =>
          typeof document !== 'undefined'
            ? document.documentElement.classList.add(className)
            : undefined,
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
  const themeHandler = useMemo(
    () => createThemeHandler(dependencies),
    [dependencies]
  );
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return createThemeHandler(dependencies).initializeTheme();
  });

  useEffect(() => {
    const initialTheme = themeHandler.initializeTheme();
    setTheme(initialTheme);
    themeHandler.applyThemeToDocument(initialTheme);
  }, [themeHandler]);

  // Monitor system theme changes
  useEffect(() => {
    const mediaQuery = dependencies.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!dependencies.localStorage.getItem('theme')) {
        const nextTheme = mediaQuery.matches ? 'dark' : 'light';
        setTheme(nextTheme);
        themeHandler.applyThemeToDocument(nextTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dependencies, themeHandler]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'light' ? 'dark' : 'light';
      themeHandler.applyThemeToDocument(nextTheme);
      themeHandler.storeTheme(nextTheme);
      return nextTheme;
    });
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
