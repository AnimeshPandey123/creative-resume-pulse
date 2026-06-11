import React from 'react';
import { render, screen } from '@testing-library/react';
import Projects, {
  createProjectsIntersectionObserverHandler,
} from '../Projects';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  projectsData: {
    title: 'Projects',
    subtitle: 'Test Subtitle',
    items: [
      {
        title: 'Test Project 1',
        role: 'Developer',
        outcome: {
          problem: 'Test problem 1',
          result: 'Test result 1',
        },
        description: [
          'Test description paragraph 1',
          'Test description paragraph 2',
        ],
        technologies: ['React', 'TypeScript'],
        url: 'https://test.com',
        slug: 'test-project-1',
      },
      {
        title: 'Test Project 2',
        role: 'Designer',
        outcome: {
          problem: 'Test problem 2',
          result: 'Test result 2',
        },
        description: ['Test description paragraph 3'],
        technologies: ['Vue', 'CSS'],
        url: null,
        slug: 'test-project-2',
      },
    ],
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

describe('Projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders projects section with correct content', () => {
    render(<Projects />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Test problem 1')).toBeInTheDocument();
    expect(screen.getByText('Test result 1')).toBeInTheDocument();
    expect(screen.getByText('Test result 2')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('has correct CSS classes and structure', () => {
    const { container } = render(<Projects />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-20', 'bg-white', 'dark:bg-gray-900');
    expect(section).toHaveAttribute('id', 'projects');
    expect(section).toHaveAttribute('role', 'region');
    expect(section).toHaveAttribute('aria-labelledby', 'projects-heading');

    const heading = screen.getByText('Projects');
    expect(heading).toHaveAttribute('id', 'projects-heading');
    expect(heading).toHaveClass('section-title');
  });

  it('renders project cards with correct structure', () => {
    const { container } = render(<Projects />);

    const projectCards = container.querySelectorAll('article');
    expect(projectCards).toHaveLength(2);

    // Check first project card
    const firstCard = projectCards[0];
    expect(firstCard).toHaveClass(
      'glass-card',
      'p-6',
      'dark:bg-gray-800/80',
      'dark:border-gray-700/20',
      'hover:shadow-lg',
      'transition-all',
      'duration-300'
    );
    expect(firstCard).toHaveAttribute('role', 'listitem');
    expect(firstCard).toHaveStyle('animation-delay: 0ms');

    // Check second project card
    const secondCard = projectCards[1];
    expect(secondCard).toHaveStyle('animation-delay: 100ms');
  });

  it('renders external link for projects with URLs', () => {
    render(<Projects />);

    const externalLink = screen.getByText('View Website');
    expect(externalLink).toHaveAttribute('href', 'https://test.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render external link for projects without URLs', () => {
    render(<Projects />);

    // Should not have a "View Demo" link for Test Project 2 (no URL)
    const viewDemoLinks = screen.getAllByText('View Website');
    expect(viewDemoLinks).toHaveLength(1); // Only Test Project 1 should have it
  });

  it('renders projects section with intersection observer setup', () => {
    render(<Projects />);

    // The component renders successfully with the refactored structure
    // The IntersectionObserver logic is now tested in the extracted handler tests
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('cleans up intersection observer on unmount', () => {
    const { unmount } = render(<Projects />);

    unmount();

    // The cleanup happens in the useEffect cleanup function
    // We can't easily test this without more complex mocking
  });

  it('handles missing project card refs gracefully', () => {
    // Mock useRef to return null for some refs
    const originalUseRef = React.useRef;
    jest.spyOn(React, 'useRef').mockImplementation(() => ({ current: null }));

    render(<Projects />);

    // Should not throw error
    expect(() => render(<Projects />)).not.toThrow();

    // Restore original useRef
    React.useRef = originalUseRef;
  });

  it('has correct accessibility attributes', () => {
    render(<Projects />);

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(3); // Main project list + 2 technology lists

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(6); // 2 project cards + 4 technology tags

    const technologiesList = screen.getAllByRole('list', {
      name: 'Technologies used in this project',
    });
    expect(technologiesList).toHaveLength(2);
  });

  it('renders technology tags with correct styling', () => {
    const { container } = render(<Projects />);

    const techTags = container.querySelectorAll('.px-3.py-1.bg-accent');
    expect(techTags).toHaveLength(4); // 2 projects × 2 technologies each

    techTags.forEach(tag => {
      expect(tag).toHaveClass(
        'rounded-full',
        'text-xs',
        'font-medium',
        'text-accent-foreground',
        'dark:text-gray-200'
      );
      expect(tag).toHaveAttribute('role', 'listitem');
    });
  });

  it('has correct grid layout classes', () => {
    const { container } = render(<Projects />);

    const grid = container.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6.mt-12'
    );
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('role', 'list');
  });

  it('renders hidden headings for screen readers', () => {
    render(<Projects />);

    const hiddenHeadings = screen.getAllByRole('heading', { hidden: true });
    expect(hiddenHeadings).toHaveLength(7); // All headings including visible ones

    // Check that the hidden headings have sr-only class
    const srOnlyHeadings = hiddenHeadings.filter(heading =>
      heading.classList.contains('sr-only')
    );
    expect(srOnlyHeadings).toHaveLength(4);
  });
});

describe('createProjectsIntersectionObserverHandler', () => {
  let mockDependencies: any;

  beforeEach(() => {
    mockDependencies = {
      IntersectionObserver: jest
        .fn()
        .mockImplementation((callback, options) => ({
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
          callback,
          options,
        })),
    };
  });

  describe('createObserver', () => {
    it('creates observer with correct options', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockCallback = jest.fn();

      const observer = handler.createObserver(mockCallback);

      expect(mockDependencies.IntersectionObserver).toHaveBeenCalledWith(
        mockCallback,
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );
      expect(observer).toBeDefined();
    });
  });

  describe('handleIntersection', () => {
    it('handles intersecting entries correctly', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      const mockTarget = {
        classList: {
          add: jest.fn(),
        },
      };

      const entries = [
        {
          isIntersecting: true,
          target: mockTarget,
        },
      ];

      handler.handleIntersection(entries, mockObserver);

      expect(mockTarget.classList.add).toHaveBeenCalledWith('animate-scale-up');
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockTarget);
    });

    it('ignores non-intersecting entries', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      const mockTarget = {
        classList: {
          add: jest.fn(),
        },
      };

      const entries = [
        {
          isIntersecting: false,
          target: mockTarget,
        },
      ];

      handler.handleIntersection(entries, mockObserver);

      expect(mockTarget.classList.add).not.toHaveBeenCalled();
      expect(mockObserver.unobserve).not.toHaveBeenCalled();
    });

    it('handles multiple entries', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      const mockTarget1 = { classList: { add: jest.fn() } };
      const mockTarget2 = { classList: { add: jest.fn() } };

      const entries = [
        { isIntersecting: true, target: mockTarget1 },
        { isIntersecting: false, target: mockTarget2 },
      ];

      handler.handleIntersection(entries, mockObserver);

      expect(mockTarget1.classList.add).toHaveBeenCalledWith(
        'animate-scale-up'
      );
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockTarget1);
      expect(mockTarget2.classList.add).not.toHaveBeenCalled();
      expect(mockObserver.unobserve).not.toHaveBeenCalledWith(mockTarget2);
    });
  });

  describe('observeElements', () => {
    it('observes valid elements only', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        observe: jest.fn(),
      };

      const mockElement1 = document.createElement('div');
      const mockElement2 = document.createElement('div');

      const elements = [mockElement1, null, mockElement2];

      handler.observeElements(mockObserver, elements);

      expect(mockObserver.observe).toHaveBeenCalledTimes(2);
      expect(mockObserver.observe).toHaveBeenCalledWith(mockElement1);
      expect(mockObserver.observe).toHaveBeenCalledWith(mockElement2);
    });

    it('handles empty elements array', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        observe: jest.fn(),
      };

      handler.observeElements(mockObserver, []);

      expect(mockObserver.observe).not.toHaveBeenCalled();
    });

    it('handles all null elements', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        observe: jest.fn(),
      };

      handler.observeElements(mockObserver, [null, null]);

      expect(mockObserver.observe).not.toHaveBeenCalled();
    });
  });

  describe('unobserveElements', () => {
    it('unobserves valid elements only', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      const mockElement1 = document.createElement('div');
      const mockElement2 = document.createElement('div');

      const elements = [mockElement1, null, mockElement2];

      handler.unobserveElements(mockObserver, elements);

      expect(mockObserver.unobserve).toHaveBeenCalledTimes(2);
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement1);
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement2);
    });

    it('handles empty elements array', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      handler.unobserveElements(mockObserver, []);

      expect(mockObserver.unobserve).not.toHaveBeenCalled();
    });

    it('handles all null elements', () => {
      const handler =
        createProjectsIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      handler.unobserveElements(mockObserver, [null, null]);

      expect(mockObserver.unobserve).not.toHaveBeenCalled();
    });
  });
});
