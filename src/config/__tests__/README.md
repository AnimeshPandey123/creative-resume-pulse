# SEO Testing Suite

This directory contains comprehensive Jest tests for the SEO configuration system to ensure all pages have proper metadata, canonical URLs, and structured data.

## Test Files

### `seo.test.ts`

Comprehensive tests for the main SEO configuration file (`src/config/seo.ts`):

- **SITE_CONFIG Tests**: Validates site configuration properties
- **Base Metadata Tests**: Tests default metadata template
- **Page Metadata Tests**: Tests predefined page metadata
- **Blog Metadata Tests**: Tests blog-specific metadata
- **Function Tests**: Tests metadata generation functions
- **Structured Data Tests**: Tests all JSON-LD structured data
- **Blog Configuration Tests**: Tests blog settings

### `../layout.test.tsx`

Tests for the main layout component (`src/app/layout.tsx`):

- **Component Rendering**: Tests layout renders correctly
- **HTML Structure**: Tests proper HTML attributes
- **Meta Tags**: Tests presence of required meta tags
- **Structured Data**: Tests structured data scripts
- **Analytics**: Tests analytics integration
- **Metadata Export**: Tests metadata configuration

### `../blog/page.test.tsx`

Tests for the blog page (`src/app/blog/page.tsx`):

- **Component Rendering**: Tests blog page renders correctly
- **Structured Data**: Tests blog page structured data
- **Metadata**: Tests blog page metadata
- **Loading State**: Tests loading fallback

### `../blog/[slug]/page.test.tsx`

Tests for individual blog post pages (`src/app/blog/[slug]/page.tsx`):

- **Component Rendering**: Tests blog post page renders correctly
- **Metadata Generation**: Tests dynamic metadata generation
- **Structured Data**: Tests blog post structured data
- **Error Handling**: Tests error scenarios
- **Static Params**: Tests static parameter generation

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### SEO Tests Only

```bash
npm run test:seo
```

### Page Tests Only

```bash
npm run test:pages
```

### All SEO and Page Tests

```bash
npm run test:all
```

## Test Coverage

### SEO Configuration Tests

- ✅ Site configuration validation
- ✅ Base metadata validation
- ✅ Page metadata validation
- ✅ Blog metadata validation
- ✅ Metadata generation functions
- ✅ Structured data validation
- ✅ Blog configuration validation

### Page Component Tests

- ✅ Layout component rendering
- ✅ Blog page rendering
- ✅ Blog post page rendering
- ✅ Metadata generation
- ✅ Structured data inclusion
- ✅ Error handling
- ✅ Loading states

### SEO Best Practices Tests

- ✅ Canonical URLs
- ✅ Meta descriptions (length validation)
- ✅ OpenGraph tags
- ✅ Twitter Card tags
- ✅ Keywords optimization
- ✅ Robots directives
- ✅ JSON-LD structured data
- ✅ Social media optimization

## Test Categories

### 1. Configuration Validation

Tests ensure all required SEO configuration properties are present and correctly formatted.

### 2. Metadata Generation

Tests validate that metadata generation functions produce correct output for different scenarios.

### 3. Structured Data

Tests verify that JSON-LD structured data is properly formatted and contains all required fields.

### 4. Page-Specific SEO

Tests ensure each page type has appropriate SEO configuration.

### 5. Error Handling

Tests verify graceful handling of error scenarios and edge cases.

### 6. Integration Tests

Tests ensure components properly integrate with SEO configuration.

## Assertions Covered

### Metadata Assertions

- Title format and content
- Description length and content
- Keywords inclusion
- Canonical URL correctness
- OpenGraph configuration
- Twitter Card configuration
- Robots directives

### Structured Data Assertions

- JSON-LD context and type
- Required properties presence
- Data format validation
- Schema compliance
- Content accuracy

### Component Assertions

- Rendering without errors
- Required elements presence
- Script inclusion
- Meta tag presence
- Error handling

## Continuous Integration

These tests can be integrated into CI/CD pipelines to ensure SEO quality:

```yaml
# Example GitHub Actions workflow
- name: Run SEO Tests
  run: npm run test:all

- name: Generate Coverage Report
  run: npm run test:coverage
```

## Maintenance

### Adding New Tests

1. Create test file in appropriate directory
2. Follow existing test patterns
3. Add comprehensive assertions
4. Update documentation

### Updating Tests

1. Update tests when SEO configuration changes
2. Ensure all new features are tested
3. Maintain test coverage above 90%

### Test Data

- Use realistic mock data
- Test edge cases and error scenarios
- Validate against SEO best practices

## SEO Validation Checklist

The tests validate against this SEO checklist:

- [ ] All pages have unique titles
- [ ] All pages have meta descriptions (50-160 characters)
- [ ] All pages have canonical URLs
- [ ] All pages have OpenGraph tags
- [ ] All pages have Twitter Card tags
- [ ] All pages have appropriate keywords
- [ ] All pages have robots directives
- [ ] All pages have structured data (where applicable)
- [ ] Blog posts have article-specific metadata
- [ ] Images have proper alt text
- [ ] URLs are SEO-friendly
- [ ] Social media optimization is implemented
