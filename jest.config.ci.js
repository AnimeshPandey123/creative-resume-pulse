const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Force React into development mode for testing
  setupFiles: ['<rootDir>/jest.env.setup.js'],
  // Environment variables for testing
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/components/ui/**',
    '!src/app/not-found.tsx',
    '!src/app/page.tsx',
    '!src/app/blog/page.tsx',
    '!src/app/feed.xml/route.ts',
    '!src/components/ClientProviders.tsx',
    '!src/components/Footer.tsx',
    '!src/components/Hero.tsx',
    '!src/components/PerformanceOptimizer.tsx',
    '!src/components/Hotjar.tsx',
    '!src/components/blog/BlogPageClient.tsx',
    '!src/components/blog/BlogPagination.tsx',
    '!src/components/blog/BlogPostCard.tsx',
    '!src/components/blog/BlogTagFilter.tsx',
    '!src/components/blog/RelatedPosts.tsx',
    '!src/data/mockBlogData.ts',
    '!src/data/serverBlogData.ts',
    '!src/hooks/use-mobile.tsx',
    '!src/hooks/use-toast.ts',
    '!src/**/node_modules/**',
    '!src/**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  // CI-specific settings
  ci: true,
  watchAll: false,
  maxWorkers: 2,
  bail: 1, // Exit on first failure
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
