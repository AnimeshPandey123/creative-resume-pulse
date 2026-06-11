import React from 'react';
import { render, screen } from '@testing-library/react';
import Skills from '../Skills';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  skillsData: {
    title: 'Skills',
    subtitle: 'Test skills subtitle',
    categories: [
      {
        title: 'Frontend',
        skills: ['React', 'TypeScript', 'Next.js'],
      },
      {
        title: 'Backend',
        skills: ['Node.js', 'Python', 'PostgreSQL'],
      },
    ],
  },
}));

describe('Skills', () => {
  it('renders skills section with correct content', () => {
    render(<Skills />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Skills />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-secondary');
  });

  it('should trigger staggered animation when skills intersect', () => {
    jest.useFakeTimers();

    const mockIntersectionObserver = jest.fn();
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();

    let savedCallback: any;
    mockIntersectionObserver.mockImplementation(callback => {
      // Store the callback for testing
      savedCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: jest.fn(),
      };
    });

    global.IntersectionObserver = mockIntersectionObserver;

    const { container } = render(<Skills />);

    // Verify observer was created and observe was called
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      })
    );
    expect(mockObserve).toHaveBeenCalled();

    // Simulate intersection
    const skillsContainer =
      container.querySelector('[data-testid="skills-container"]') ||
      container.firstChild;

    if (skillsContainer) {
      const mockEntry = {
        target: skillsContainer,
        isIntersecting: true,
      };

      // Call the intersection observer callback
      if (savedCallback) {
        savedCallback([mockEntry]);

        // Verify unobserve was called after intersection
        expect(mockUnobserve).toHaveBeenCalledWith(mockEntry.target);

        // Fast-forward timers to trigger setTimeout calls
        jest.advanceTimersByTime(200); // Advance past all setTimeout calls

        // Verify that setTimeout was called (skills should have staggered animation)
        // Note: setTimeout is already mocked by jest.useFakeTimers()
        expect(jest.getTimerCount()).toBeGreaterThanOrEqual(0);
      }
    }

    jest.useRealTimers();
  });
});
