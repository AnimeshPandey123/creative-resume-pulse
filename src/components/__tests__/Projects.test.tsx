import React from 'react';
import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  projectsData: {
    title: 'Projects',
    items: [
      {
        title: 'Test Project',
        description: [
          'Test description paragraph 1',
          'Test description paragraph 2',
        ],
        image: '/test-image.jpg',
        technologies: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test',
        liveUrl: 'https://test.com',
      },
    ],
  },
}));

describe('Projects', () => {
  it('renders projects section with correct content', () => {
    render(<Projects />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(
      screen.getByText('Test description paragraph 1')
    ).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Projects />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-white');
  });

  it('should trigger animation when project cards intersect', () => {
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

    const { container } = render(<Projects />);

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

    // Simulate intersection for project cards
    const projectCards =
      container.querySelectorAll('[data-testid="project-card"]') ||
      container.querySelectorAll('article');

    if (projectCards.length > 0) {
      const mockEntry = {
        target: projectCards[0],
        isIntersecting: true,
      };

      // Call the intersection observer callback
      if (savedCallback) {
        savedCallback([mockEntry]);

        // Verify unobserve was called after intersection
        expect(mockUnobserve).toHaveBeenCalledWith(mockEntry.target);
      }
    }
  });
});
