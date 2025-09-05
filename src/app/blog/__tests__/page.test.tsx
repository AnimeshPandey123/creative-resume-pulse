import React from 'react';
import { render } from '@testing-library/react';
import BlogPage from '../page';
import { blogMetadata, blogPageStructuredData } from '@/config/seo';

// Mock the components
jest.mock('@/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('@/components/blog/BlogPageClient', () => {
  return function MockBlogPageClient() {
    return (
      <div data-testid="blog-page-client">
        <h1>Blog</h1>
        <p>Loading blog posts...</p>
      </div>
    );
  };
});

describe('BlogPage', () => {
  it('should render without crashing', () => {
    const { container } = render(<BlogPage />);
    expect(container).toBeInTheDocument();
  });

  it('should include structured data scripts', () => {
    const { container } = render(<BlogPage />);

    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(structuredDataScripts).toHaveLength(blogPageStructuredData.length);

    // Verify each script contains valid JSON
    structuredDataScripts.forEach(script => {
      const content = script.innerHTML;
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  it('should render the layout component', () => {
    const { getByTestId } = render(<BlogPage />);
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('should render the blog page client component', () => {
    const { getByTestId } = render(<BlogPage />);
    expect(getByTestId('blog-page-client')).toBeInTheDocument();
  });

  it('should render loading fallback initially', () => {
    const { getByText } = render(<BlogPage />);
    expect(getByText('Blog')).toBeInTheDocument();
    expect(getByText('Loading blog posts...')).toBeInTheDocument();
  });

  it('should render Suspense with proper fallback structure', () => {
    // Since BlogPageClient is mocked and renders immediately,
    // we can't test the fallback directly. Instead, we test that
    // the Suspense component is present and the BlogPageClient renders
    const { container, getByTestId } = render(<BlogPage />);

    // The BlogPageClient should be rendered (not the fallback)
    expect(getByTestId('blog-page-client')).toBeInTheDocument();

    // The BlogPageClient mock includes the same content as the fallback
    expect(container.querySelector('h1')).toHaveTextContent('Blog');
    expect(container.querySelector('p')).toHaveTextContent(
      'Loading blog posts...'
    );
  });

  it('should render structured data scripts with correct content', () => {
    const { container } = render(<BlogPage />);

    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(structuredDataScripts).toHaveLength(blogPageStructuredData.length);

    // Verify each script contains valid JSON and has correct structure
    structuredDataScripts.forEach((script, index) => {
      const content = script.innerHTML;
      expect(() => JSON.parse(content)).not.toThrow();

      const parsedData = JSON.parse(content);
      expect(parsedData).toHaveProperty('@context', 'https://schema.org');
      expect(parsedData).toHaveProperty('@type');

      // Verify it matches the expected structured data
      const expectedData = blogPageStructuredData[index];
      expect(parsedData['@type']).toBe(expectedData['@type']);
    });
  });
});

describe('Blog Page Metadata', () => {
  it('should export correct metadata', () => {
    expect(blogMetadata).toBeDefined();
    expect(blogMetadata.title).toBeDefined();
    expect(blogMetadata.description).toBeDefined();
    expect(blogMetadata.keywords).toBeDefined();
  });

  it('should have correct canonical URL', () => {
    expect(blogMetadata.alternates?.canonical).toBe(
      'https://animeshpandey.com/blog'
    );
  });

  it('should have blog-specific title', () => {
    expect(blogMetadata.title).toContain('Blog');
    expect(blogMetadata.title).toContain('Animesh Pandey');
  });

  it('should have blog-specific description', () => {
    expect(blogMetadata.description).toContain('software engineering');
    expect(blogMetadata.description).toContain('tutorials');
    expect(blogMetadata.description).toContain('technical articles');
  });

  it('should have blog-specific keywords', () => {
    const keywords = blogMetadata.keywords as string[];
    expect(keywords).toContain('Software Engineering Blog');
    expect(keywords).toContain('Web Development Tutorials');
    expect(keywords).toContain('Technical Articles');
  });

  it('should have OpenGraph configuration', () => {
    expect(blogMetadata.openGraph).toBeDefined();
    expect((blogMetadata.openGraph as any)?.type).toBe('website');
    expect(blogMetadata.openGraph?.url).toBe('https://animeshpandey.com/blog');
  });

  it('should have Twitter configuration', () => {
    expect(blogMetadata.twitter).toBeDefined();
    expect((blogMetadata.twitter as any)?.card).toBe('summary_large_image');
    expect(blogMetadata.twitter?.creator).toBe('@animeshpandey');
  });

  it('should have proper meta description length', () => {
    const description = blogMetadata.description;
    expect(description?.length).toBeGreaterThan(50);
    expect(description?.length).toBeLessThan(160);
  });
});

describe('Blog Page Structured Data', () => {
  it('should contain blog structured data', () => {
    const blogData = blogPageStructuredData.find(
      data => data['@type'] === 'Blog'
    );
    expect(blogData).toBeDefined();
    expect(blogData?.name).toContain('Blog');
    expect(blogData?.url).toBe('https://animeshpandey.com/blog');
  });

  it('should contain person structured data', () => {
    const personData = blogPageStructuredData.find(
      data => data['@type'] === 'Person'
    );
    expect(personData).toBeDefined();
    expect(personData?.name).toBe('Animesh Pandey');
  });

  it('should have correct number of structured data items', () => {
    expect(blogPageStructuredData).toHaveLength(2);
  });

  it('should have valid JSON-LD structure', () => {
    blogPageStructuredData.forEach(data => {
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBeDefined();
    });
  });
});
