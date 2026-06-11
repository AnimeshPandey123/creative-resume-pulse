import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import About from '../About';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="about-photo" />
  ),
}));

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

jest.mock('@/data/landingData', () => ({
  aboutData: {
    title: 'About Me',
    subtitle: 'Test subtitle',
    personalLine: 'Test personal line',
    content: ['Test content paragraph 1'],
    contact: {
      location: 'Test Location',
      phone: '+1234567890',
      email: 'test@example.com',
    },
  },
}));

describe('About', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders about section with correct content', () => {
    render(<About />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test personal line')).toBeInTheDocument();
    expect(screen.getByText('Test content paragraph 1')).toBeInTheDocument();
  });

  it('renders profile photo', () => {
    render(<About />);

    expect(screen.getByTestId('about-photo')).toHaveAttribute(
      'alt',
      'Portrait of Animesh Pandey'
    );
  });

  it('does not render duplicate contact information', () => {
    render(<About />);

    expect(screen.queryByText('Location:')).not.toBeInTheDocument();
    expect(screen.queryByText('Email:')).not.toBeInTheDocument();
    expect(screen.queryByText('Phone:')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<About />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-white');
  });

  it('has correct accessibility attributes', () => {
    render(<About />);

    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toHaveAttribute('id', 'about');
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'about-heading');
  });

  it('sets up IntersectionObserver on mount', () => {
    render(<About />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
  });
});
