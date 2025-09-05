import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

// Mock the components that Layout uses
jest.mock('@/components/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation</div>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('@/components/ThemeProvider', () => {
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="theme-provider">{children}</div>
    ),
  };
});

describe('Layout', () => {
  it('should render with all required components', () => {
    render(
      <Layout>
        <div data-testid="main-content">Main Content</div>
      </Layout>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    // Find the div with the layout classes
    const mainDiv = container.querySelector('div.min-h-screen') as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'flex', 'flex-col');

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-grow');
  });

  it('should render children in main element', () => {
    const testContent = 'Test child content';
    render(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
    expect(screen.getByText(testContent).closest('main')).toBeInTheDocument();
  });
});
