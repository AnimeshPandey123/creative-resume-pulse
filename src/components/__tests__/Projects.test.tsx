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
});
