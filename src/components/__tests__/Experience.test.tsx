import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Experience, {
  createExperienceIntersectionObserverHandler,
  isFeaturedExperience,
} from '../Experience';

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

jest.mock('@/data/landingData', () => ({
  experienceData: {
    title: 'Professional Experience',
    subtitle:
      'A track record of impactful roles, technical leadership, and shipping production-ready code.',
    earlierRolesLabel: 'Earlier roles',
    items: [
      {
        title: 'Sr. Full Stack Developer',
        company: 'ASquared | Digital Product Agency',
        period: 'Nov 2025 - Present',
        location: 'UK',
        responsibilities: ['Deliver client-facing full-stack solutions.'],
      },
      {
        title: 'Sr. Python Software Engineer',
        company: 'Mercor',
        period: 'May 2025 - July 2025',
        location: 'USA',
        responsibilities: [
          'Managed Docker environments across multiple repositories to streamline development and deployment.',
        ],
      },
      {
        title: 'Sr. Full Stack Developer',
        company: 'Red Airship',
        period: 'July 2022 - July 2024',
        location: 'Singapore',
        responsibilities: [
          'Reduced frontend load time by 80% with optimization and lazy loading; implemented CI/CD pipelines cutting deployments from 1 hour to 5 minutes.',
        ],
      },
    ],
  },
}));

describe('isFeaturedExperience', () => {
  it('returns true for featured companies', () => {
    expect(isFeaturedExperience('ASquared | Digital Product Agency')).toBe(
      true
    );
    expect(isFeaturedExperience('Red Airship')).toBe(true);
  });

  it('returns false for other companies', () => {
    expect(isFeaturedExperience('Mercor')).toBe(false);
    expect(isFeaturedExperience('Hazesoft')).toBe(false);
  });
});

describe('Experience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders experience section with correct content', () => {
    render(<Experience />);

    expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    expect(
      screen.getByText('ASquared | Digital Product Agency')
    ).toBeInTheDocument();
    expect(screen.getByText('Red Airship')).toBeInTheDocument();
  });

  it('shows earlier roles toggle and hides non-featured roles by default', () => {
    render(<Experience />);

    expect(
      screen.getByRole('button', { name: /earlier roles \(1\)/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Mercor')).not.toBeInTheDocument();
  });

  it('reveals earlier roles when toggle is clicked', () => {
    render(<Experience />);

    fireEvent.click(
      screen.getByRole('button', { name: /earlier roles \(1\)/i })
    );

    expect(screen.getByText('Mercor')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Managed Docker environments across multiple repositories to streamline development and deployment.'
      )
    ).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Experience />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-accent/50');
  });

  it('has correct accessibility attributes', () => {
    render(<Experience />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'experience');
    expect(section).toHaveAttribute('aria-labelledby', 'experience-heading');
  });

  it('renders time elements for featured roles', () => {
    render(<Experience />);

    const timeElements = document.querySelectorAll('time');
    expect(timeElements).toHaveLength(2);
    expect(timeElements[0]).toHaveAttribute('datetime', 'Nov 2025 - Present');
    expect(timeElements[1]).toHaveAttribute(
      'datetime',
      'July 2022 - July 2024'
    );
  });
});

describe('createExperienceIntersectionObserverHandler', () => {
  let mockDependencies: {
    IntersectionObserver: jest.Mock;
  };

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
        createExperienceIntersectionObserverHandler(mockDependencies);
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
        createExperienceIntersectionObserverHandler(mockDependencies);
      const mockObserver = {
        unobserve: jest.fn(),
      };

      const mockTarget = {
        classList: {
          add: jest.fn(),
        },
      };

      handler.handleIntersection(
        [
          {
            isIntersecting: true,
            target: mockTarget,
          },
        ],
        mockObserver
      );

      expect(mockTarget.classList.add).toHaveBeenCalledWith(
        'animate-fade-in-left'
      );
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockTarget);
    });
  });
});
