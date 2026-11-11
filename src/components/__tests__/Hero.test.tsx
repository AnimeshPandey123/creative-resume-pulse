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
  resumeData: {
    href: '/cv/FullStackDeveloperAnimeshResume.pdf',
    label: 'Download CV',
    downloadName: 'Animesh-Pandey-CV.pdf',
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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "Hi, I'm Test Name."
    );
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Primary CTA')).toBeInTheDocument();
    expect(screen.getByText(/Secondary CTA/)).toBeInTheDocument();
    expect(screen.getByText(/Download CV/)).toBeInTheDocument();
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

    const resumeLink = screen.getByLabelText(
      "Download Animesh Pandey's CV as PDF"
    );
    expect(resumeLink).toHaveAttribute(
      'href',
      '/cv/FullStackDeveloperAnimeshResume.pdf'
    );
    expect(resumeLink).toHaveAttribute('download', 'Animesh-Pandey-CV.pdf');

    const scrollDownLink = screen.getByLabelText(
      'Scroll down to About section'
    );
    expect(scrollDownLink).toBeInTheDocument();
  });

  it('has correct CSS classes and structure', () => {
    const { container } = render(<Hero />);

    const heroSection = container.querySelector('section');
    expect(heroSection).toHaveClass('relative', 'overflow-hidden', 'pt-28');

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('section-kicker', 'animate-fade-in');

    const name = screen.getByRole('heading', { level: 1 });
    expect(name).toHaveClass(
      'font-display',
      'font-medium',
      'tracking-tight',
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
    expect(navigation).toHaveClass('flex', 'flex-wrap', 'gap-x-6');
  });

  it('has correct scroll down button', () => {
    render(<Hero />);

    const scrollButton = screen.getByLabelText('Scroll down to About section');
    expect(scrollButton).toHaveAttribute('href', '#about');
    expect(scrollButton).toHaveClass('text-link');
  });

  it('has correct container structure', () => {
    const { container } = render(<Hero />);

    const containerDiv = container.querySelector('.section-container');
    expect(containerDiv).toHaveClass('relative', 'z-10');
  });
});
