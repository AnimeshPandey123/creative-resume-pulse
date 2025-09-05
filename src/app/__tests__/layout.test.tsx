import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../layout';
import { baseMetadata, mainStructuredData } from '@/config/seo';

// Suppress console warnings for DOM nesting issues in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('validateDOMNesting')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock the components
jest.mock('@/components/ClientProviders', () => {
  return function MockClientProviders({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="client-providers">{children}</div>;
  };
});

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="analytics" />,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe('RootLayout', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );
    expect(container).toBeInTheDocument();
  });

  it('should have correct HTML lang attribute', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );
    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('should include all required meta tags', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    // Check for favicon
    expect(container.querySelector('link[rel="icon"]')).toBeInTheDocument();
    expect(
      container.querySelector('link[rel="apple-touch-icon"]')
    ).toBeInTheDocument();
    expect(container.querySelector('link[rel="manifest"]')).toBeInTheDocument();

    // Check for preconnect links
    expect(
      container.querySelector(
        'link[rel="preconnect"][href="https://fonts.googleapis.com"]'
      )
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        'link[rel="preconnect"][href="https://fonts.gstatic.com"]'
      )
    ).toBeInTheDocument();

    // Check for DNS prefetch
    expect(
      container.querySelector(
        'link[rel="dns-prefetch"][href="//fonts.googleapis.com"]'
      )
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        'link[rel="dns-prefetch"][href="//fonts.gstatic.com"]'
      )
    ).toBeInTheDocument();

    // Check for preload
    expect(
      container.querySelector('link[rel="preload"][href="/favicon.ico"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        'link[rel="preload"][href="/opengraph-image.png"]'
      )
    ).toBeInTheDocument();
  });

  it('should include structured data scripts', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(structuredDataScripts).toHaveLength(mainStructuredData.length);

    // Verify each script contains valid JSON
    structuredDataScripts.forEach(script => {
      const content = script.innerHTML;
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  it('should include analytics and speed insights', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(getByTestId('analytics')).toBeInTheDocument();
    expect(getByTestId('speed-insights')).toBeInTheDocument();
  });

  it('should wrap content in ClientProviders', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(getByTestId('client-providers')).toBeInTheDocument();
  });

  it('should have correct body classes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    const body = container.querySelector('body');
    expect(body).toHaveClass('font-sans', 'antialiased');
  });
});

describe('Layout Metadata', () => {
  it('should export correct metadata', () => {
    expect(baseMetadata).toBeDefined();
    expect(baseMetadata.title).toBeDefined();
    expect(baseMetadata.description).toBeDefined();
    expect(baseMetadata.keywords).toBeDefined();
  });

  it('should have correct canonical URL', () => {
    expect(baseMetadata.alternates?.canonical).toBe(
      'https://animeshpandey.com'
    );
  });

  it('should have OpenGraph configuration', () => {
    expect(baseMetadata.openGraph).toBeDefined();
    expect((baseMetadata.openGraph as any)?.type).toBe('website');
    expect(baseMetadata.openGraph?.url).toBe('https://animeshpandey.com');
  });

  it('should have Twitter configuration', () => {
    expect(baseMetadata.twitter).toBeDefined();
    expect((baseMetadata.twitter as any)?.card).toBe('summary_large_image');
    expect(baseMetadata.twitter?.creator).toBe('@animeshpandey');
  });
});
