import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

jest.mock('@/data/landingData', () => ({
  heroData: {
    title: 'Test Title',
    name: 'Test Name',
    subtitle: 'Test Subtitle',
    cta: {
      primary: {
        text: 'Primary CTA',
        href: '#contact',
      },
      secondary: {
        text: 'Secondary CTA',
        href: '#projects',
      },
    },
  },
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: jest.fn(),
});

global.IntersectionObserver = mockIntersectionObserver;

describe('Hero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with correct content', () => {
    render(<Hero />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Primary CTA')).toBeInTheDocument();
    expect(screen.getByText('Secondary CTA')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<Hero />);

    const heroSection = screen.getAllByRole('banner')[0];
    expect(heroSection).toHaveAttribute('aria-label', 'Hero section');

    const primaryCTA = screen.getByLabelText(
      'Get in touch with Animesh Pandey'
    );
    expect(primaryCTA).toBeInTheDocument();

    const secondaryCTA = screen.getByLabelText(
      "View Animesh Pandey's projects"
    );
    expect(secondaryCTA).toBeInTheDocument();

    const scrollDownLink = screen.getByLabelText(
      'Scroll down to About section'
    );
    expect(scrollDownLink).toBeInTheDocument();
  });

  it('has correct CSS classes and structure', () => {
    const { container } = render(<Hero />);

    const heroSection = container.querySelector('section');
    expect(heroSection).toHaveClass(
      'relative',
      'min-h-screen',
      'overflow-hidden',
      'pt-24',
      'md:pt-28',
      'pb-24'
    );

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass(
      'text-primary',
      'font-medium',
      'tracking-widest',
      'uppercase',
      'mb-4',
      'animate-fade-in'
    );

    const name = screen.getByText("Hello, I'm");
    expect(name).toHaveClass(
      'text-4xl',
      'md:text-5xl',
      'lg:text-6xl',
      'font-display',
      'font-bold',
      'leading-tight',
      'mb-6',
      'animate-fade-in',
      'animate-delay-100'
    );
  });

  it('sets up intersection observer for subtitle animation', () => {
    render(<Hero />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    expect(mockObserve).toHaveBeenCalled();
  });

  it('handles intersection observer callback correctly', () => {
    render(<Hero />);

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockObserver = { unobserve: jest.fn() };

    const mockTarget = document.createElement('p');
    mockTarget.className = 'test-subtitle';

    observerCallback(
      [
        {
          target: mockTarget,
          isIntersecting: true,
        },
      ],
      mockObserver
    );

    expect(mockTarget.classList.contains('animate-fade-in')).toBe(true);
  });

  it('does not add animation class when not intersecting', () => {
    render(<Hero />);

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockObserver = { unobserve: jest.fn() };

    const mockTarget = document.createElement('p');
    mockTarget.className = 'test-subtitle';

    observerCallback(
      [
        {
          target: mockTarget,
          isIntersecting: false,
        },
      ],
      mockObserver
    );

    expect(mockTarget.classList.contains('animate-fade-in')).toBe(false);
    expect(mockObserver.unobserve).not.toHaveBeenCalled();
  });

  it('cleans up intersection observer on unmount', () => {
    const { unmount } = render(<Hero />);

    unmount();

    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('handles missing subtitle ref gracefully', () => {
    const originalUseRef = React.useRef;
    jest.spyOn(React, 'useRef').mockImplementation(() => ({ current: null }));

    render(<Hero />);

    expect(() => render(<Hero />)).not.toThrow();

    React.useRef = originalUseRef;
  });

  it('has correct navigation structure', () => {
    render(<Hero />);

    const navigation = screen.getByRole('navigation', {
      name: 'Primary navigation',
    });
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveClass(
      'flex',
      'flex-col',
      'sm:flex-row',
      'justify-center',
      'gap-3',
      'animate-fade-in',
      'animate-delay-200'
    );
  });

  it('has correct scroll down button', () => {
    render(<Hero />);

    const scrollButton = screen.getByLabelText('Scroll down to About section');
    expect(scrollButton).toHaveAttribute('href', '#about');
    const scrollContainer = scrollButton.parentElement;
    expect(scrollContainer).toHaveClass(
      'absolute',
      'bottom-8',
      'left-1/2',
      '-translate-x-1/2',
      'animate-bounce'
    );
  });

  it('has correct gradient background', () => {
    const { container } = render(<Hero />);

    const gradientDiv = container.querySelector(
      '.absolute.inset-0.bg-gradient-to-b'
    );
    expect(gradientDiv).toHaveClass(
      'from-accent/30',
      'to-transparent',
      'opacity-70',
      'z-0'
    );
  });

  it('has correct container structure', () => {
    const { container } = render(<Hero />);

    const containerDiv = container.querySelector('.container.mx-auto.px-4');
    expect(containerDiv).toHaveClass('relative', 'z-10');

    const maxWidthDiv = container.querySelector(
      '.max-w-3xl.mx-auto.text-center'
    );
    expect(maxWidthDiv).toBeInTheDocument();
  });
});
