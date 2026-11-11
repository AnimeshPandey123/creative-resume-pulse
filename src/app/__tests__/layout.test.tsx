import React from 'react';
import { render, screen } from '@testing-library/react';
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

jest.mock('@/components/DeferredAnalytics', () => {
  return function MockDeferredAnalytics() {
    return <div data-testid="deferred-analytics" />;
  };
});

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
    expect(html).toHaveAttribute('lang', 'en-GB');
  });

  it('should include required icon and manifest tags without eager preloads', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(container.querySelector('link[rel="icon"]')).toBeInTheDocument();
    expect(
      container.querySelector('link[rel="apple-touch-icon"]')
    ).toBeInTheDocument();
    expect(container.querySelector('link[rel="manifest"]')).toBeInTheDocument();

    expect(
      container.querySelector('link[rel="preconnect"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('link[rel="dns-prefetch"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('link[rel="preload"]')
    ).not.toBeInTheDocument();
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

  it('should include analytics, speed insights, and deferred third parties', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(getByTestId('analytics')).toBeInTheDocument();
    expect(getByTestId('speed-insights')).toBeInTheDocument();
    expect(getByTestId('deferred-analytics')).toBeInTheDocument();
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

  it('should include RSS feed link', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    const rssLink = container.querySelector(
      'link[rel="alternate"][type="application/rss+xml"]'
    );
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveAttribute('href', '/feed.xml');
    expect(rssLink).toHaveAttribute('title', 'Animesh Pandey Blog RSS Feed');
  });

  it('should include all favicon and app icon links', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    // Check favicon.ico
    expect(
      container.querySelector(
        'link[rel="icon"][type="image/x-icon"][href="/favicon.ico"]'
      )
    ).toBeInTheDocument();

    // Check apple-touch-icon
    expect(
      container.querySelector('link[rel="apple-touch-icon"][sizes="180x180"]')
    ).toBeInTheDocument();

    // Check favicon-32x32
    expect(
      container.querySelector(
        'link[rel="icon"][type="image/png"][sizes="32x32"]'
      )
    ).toBeInTheDocument();

    // Check favicon-16x16
    expect(
      container.querySelector(
        'link[rel="icon"][type="image/png"][sizes="16x16"]'
      )
    ).toBeInTheDocument();

    // Check manifest
    expect(
      container.querySelector('link[rel="manifest"][href="/site.webmanifest"]')
    ).toBeInTheDocument();
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

  it('should handle missing GA measurement ID', () => {
    // Store original env var
    const originalGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Remove GA measurement ID
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    const testChildren = <div>Test content</div>;
    render(<RootLayout>{testChildren}</RootLayout>);

    // Should still render without crashing
    expect(screen.getByTestId('client-providers')).toBeInTheDocument();

    // Restore original env var
    if (originalGaId) {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGaId;
    }
  });
});
