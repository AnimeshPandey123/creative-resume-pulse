import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const eslintConfig = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        URLSearchParams: 'readonly',
        IntersectionObserver: 'readonly',
        requestIdleCallback: 'readonly',
        // HTML element types
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLHeadingElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLUListElement: 'readonly',
        HTMLLIElement: 'readonly',
        HTMLTableElement: 'readonly',
        HTMLTableSectionElement: 'readonly',
        HTMLTableRowElement: 'readonly',
        HTMLTableCellElement: 'readonly',
        HTMLTableCaptionElement: 'readonly',
        HTMLOListElement: 'readonly',
        HTMLImageElement: 'readonly',
        // Node.js globals
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        // Event types
        KeyboardEvent: 'readonly',
        // Web API types
        Request: 'readonly',
        Response: 'readonly',
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Next.js specific rules
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',

      // React rules
      'react/no-unescaped-entities': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // Import rules
      'import/no-anonymous-default-export': 'off',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          args: 'none',
        },
      ],
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with TypeScript rule

      // General rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-redeclare': 'off', // Allow redeclaration for test files
    },
  },
  // Add Jest globals for test files so lint does not flag them as undefined
  {
    files: [
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      'jest.setup.js',
    ],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
  // Node.js environment for scripts and config files
  {
    files: [
      'scripts/**/*.{js,ts,mjs}',
      '*.config.{js,ts,mjs}',
      'jest.*.js',
      'api/**/*.{js,ts}',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'scripts-dist/**',
    ],
  },
];

export default eslintConfig;
