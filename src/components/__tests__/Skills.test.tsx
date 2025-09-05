import React from 'react';
import { render, screen } from '@testing-library/react';
import Skills from '../Skills';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  skillsData: {
    title: 'Skills',
    categories: [
      {
        name: 'Frontend',
        skills: ['React', 'TypeScript', 'Next.js'],
      },
      {
        name: 'Backend',
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
});
