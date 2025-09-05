describe('Coverage Parsing Logic', () => {
  // Mock Jest coverage output format
  const mockCoverageOutput = `
Running coverage on untested files...🚀 Generating sitemaps for Next.js...
✅ Main sitemap generated successfully
✅ Blog sitemap generated successfully with 5 posts
✅ Sitemap index generated successfully
✅ All sitemaps generated successfully!
--------------------|---------|----------|---------|---------|------------------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s            
--------------------|---------|----------|---------|---------|------------------------------
All files           |   79.56 |    64.28 |   75.38 |   80.95 |                              
 app                |   95.83 |      100 |     100 |     100 |                              
  layout.tsx        |    92.3 |      100 |     100 |     100 |                              
  not-found.tsx     |     100 |      100 |     100 |     100 |                              
  page.tsx          |     100 |      100 |     100 |     100 |                              
 app/blog           |    87.5 |      100 |     100 |     100 |                              
  page.tsx          |    87.5 |      100 |     100 |     100 |                              
 app/blog/[slug]    |     100 |      100 |     100 |     100 |                              
  page.tsx          |     100 |      100 |     100 |     100 |                              
 config             |   93.47 |    89.47 |   88.88 |     100 |                              
  seo.ts            |   93.47 |    89.47 |   88.88 |     100 | 267,464                      
 data               |   76.59 |    30.43 |   90.47 |   75.36 |                              
  landingData.ts    |   88.23 |      100 |     100 |     100 |                              
  mockBlogData.ts   |   95.74 |       60 |     100 |     100 | 20,59-61                     
  serverBlogData.ts |      40 |     7.69 |      50 |   34.61 | 10-21,32-55                  
 hooks              |   57.14 |    56.25 |    40.9 |   58.46 |                              
  use-mobile.tsx    |     100 |      100 |     100 |     100 |                              
  use-toast.ts      |   47.36 |    56.25 |   27.77 |   49.05 | 28-29,60,64-65,98-99,135-192 
 lib                |     100 |      100 |     100 |     100 |                              
  utils.ts          |     100 |      100 |     100 |     100 |                              
--------------------|---------|----------|---------|---------|------------------------------

Test Suites: 26 passed, 26 total
Tests:       140 passed, 140 total
Snapshots:   0 total
Time:        4.875 s, estimated 5 s
Ran all test suites.
`;

  test('should extract coverage line correctly', () => {
    const coverageLine = mockCoverageOutput
      .split('\n')
      .find(line => line.includes('All files'));
    expect(coverageLine).toBe(
      'All files           |   79.56 |    64.28 |   75.38 |   80.95 |                              '
    );
  });

  test('should parse coverage percentage with current regex', () => {
    const coverageLine = mockCoverageOutput
      .split('\n')
      .find(line => line.includes('All files'));
    const currentRegex = /([0-9]+\.[0-9]+)%/;
    const match = coverageLine?.match(currentRegex);

    // This should fail because Jest doesn't output % symbol
    expect(match).toBeNull();
  });

  test('should parse coverage percentage with corrected regex', () => {
    const coverageLine = mockCoverageOutput
      .split('\n')
      .find(line => line.includes('All files'));
    // Look for the first percentage number (statements coverage)
    const correctedRegex = /All files\s+\|\s+([0-9]+\.[0-9]+)/;
    const match = coverageLine?.match(correctedRegex);

    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('79.56');
  });

  test('should handle different coverage formats', () => {
    const differentFormats = [
      'All files           |   79.56 |    64.28 |   75.38 |   80.95 |',
      'All files | 79.56 | 64.28 | 75.38 | 80.95 |',
      'All files|79.56|64.28|75.38|80.95|',
      'All files           |   100.00 |      100 |     100 |     100 |',
    ];

    const regex = /All files\s*\|\s*([0-9]+\.[0-9]+)/;

    differentFormats.forEach(format => {
      const match = format.match(regex);
      expect(match).not.toBeNull();
      expect(match?.[1]).toBeDefined();
    });
  });

  test('should extract multiple coverage metrics', () => {
    const coverageLine = mockCoverageOutput
      .split('\n')
      .find(line => line.includes('All files'));
    const regex =
      /All files\s+\|\s+([0-9]+\.[0-9]+)\s+\|\s+([0-9]+\.[0-9]+)\s+\|\s+([0-9]+\.[0-9]+)\s+\|\s+([0-9]+\.[0-9]+)/;
    const match = coverageLine?.match(regex);

    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('79.56'); // Statements
    expect(match?.[2]).toBe('64.28'); // Branches
    expect(match?.[3]).toBe('75.38'); // Functions
    expect(match?.[4]).toBe('80.95'); // Lines
  });

  test('should handle edge cases', () => {
    const edgeCases = [
      'All files           |    0.00 |      0.00 |     0.00 |     0.00 |',
      'All files           |  100.00 |    100.00 |   100.00 |   100.00 |',
      'All files           |    1.23 |     45.67 |    89.01 |    23.45 |',
    ];

    const regex = /All files\s+\|\s+([0-9]+\.[0-9]+)/;

    edgeCases.forEach(format => {
      const match = format.match(regex);
      expect(match).not.toBeNull();
      const percentage = parseFloat(match![1]);
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });
});
