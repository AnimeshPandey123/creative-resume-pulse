import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import About from '../About';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  aboutData: {
    title: 'About Me',
    subtitle: 'Test subtitle',
    content: ['Test content paragraph 1', 'Test content paragraph 2'],
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
    expect(screen.getByText('Test content paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Test content paragraph 2')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<About />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-white');
  });

  it('renders contact information correctly', () => {
    render(<About />);

    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
  });

  it('renders contact links with correct attributes', () => {
    render(<About />);

    const emailLink = screen.getByRole('link', {
      name: /send email to animesh pandey/i,
    });
    const phoneLink = screen.getByRole('link', {
      name: /call animesh pandey/i,
    });

    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
  });

  it('has correct accessibility attributes', () => {
    render(<About />);

    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toHaveAttribute('id', 'about');
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'about-heading');

    const contactHeading = screen.getByRole('heading', { level: 3 });
    expect(contactHeading).toHaveClass('sr-only');
    expect(contactHeading).toHaveTextContent('Contact Information');
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

  it('triggers animation when element intersects', () => {
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn(),
    });

    render(<About />);

    // Get the callback function passed to IntersectionObserver
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Create a mock entry that is intersecting
    const mockEntry = {
      isIntersecting: true,
      target: {
        classList: {
          add: jest.fn(),
        },
      },
    };

    // Call the observer callback
    observerCallback([mockEntry]);

    // Verify that the animation class is added and element is unobserved
    expect(mockEntry.target.classList.add).toHaveBeenCalledWith(
      'animate-fade-in'
    );
    expect(mockUnobserve).toHaveBeenCalledWith(mockEntry.target);
  });

  it('does not trigger animation when element is not intersecting', () => {
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn(),
    });

    render(<About />);

    // Get the callback function passed to IntersectionObserver
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Create a mock entry that is not intersecting
    const mockEntry = {
      isIntersecting: false,
      target: {
        classList: {
          add: jest.fn(),
        },
      },
    };

    // Call the observer callback
    observerCallback([mockEntry]);

    // Verify that the animation class is not added and element is not unobserved
    expect(mockEntry.target.classList.add).not.toHaveBeenCalled();
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it('cleans up IntersectionObserver on unmount', () => {
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();
    const mockDisconnect = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    });

    const { unmount } = render(<About />);

    // Simulate unmounting
    unmount();

    // Verify cleanup is called
    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('handles multiple entries in observer callback', () => {
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn(),
    });

    render(<About />);

    // Get the callback function passed to IntersectionObserver
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Create multiple mock entries
    const mockEntries = [
      {
        isIntersecting: true,
        target: {
          classList: {
            add: jest.fn(),
          },
        },
      },
      {
        isIntersecting: false,
        target: {
          classList: {
            add: jest.fn(),
          },
        },
      },
    ];

    // Call the observer callback with multiple entries
    observerCallback(mockEntries);

    // Verify that only the intersecting entry gets the animation class
    expect(mockEntries[0].target.classList.add).toHaveBeenCalledWith(
      'animate-fade-in'
    );
    expect(mockEntries[1].target.classList.add).not.toHaveBeenCalled();
    expect(mockUnobserve).toHaveBeenCalledWith(mockEntries[0].target);
  });

  it('renders all content paragraphs with correct structure', () => {
    render(<About />);

    const paragraphs = screen.getAllByText(/Test content paragraph/);
    expect(paragraphs).toHaveLength(2);

    paragraphs.forEach((paragraph, index) => {
      expect(paragraph).toHaveClass(
        'text-lg',
        'leading-relaxed',
        'mb-6',
        'text-foreground'
      );
      expect(paragraph).toHaveTextContent(
        `Test content paragraph ${index + 1}`
      );
    });
  });

  it('renders contact information in address element', () => {
    render(<About />);

    // The address element should have the contact information classes
    const address = document.querySelector('address');
    expect(address).toHaveClass('flex', 'flex-wrap', 'gap-4', 'not-italic');
  });
});
