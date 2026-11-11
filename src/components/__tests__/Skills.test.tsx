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

  it('renders capability rows without hiding them', () => {
    const { container } = render(<Skills />);
    const rows = container.querySelectorAll('.index-row');

    expect(rows.length).toBeGreaterThan(0);
    rows.forEach(row => {
      expect(row).not.toHaveClass('opacity-0');
      expect(row).not.toHaveClass('blog-card-pending');
    });
  });

  it('shows every row immediately when motion is reduced', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { container } = render(<Skills />);
    const rows = container.querySelectorAll('.index-row');

    expect(rows.length).toBeGreaterThan(0);
    rows.forEach(row => {
      expect(row).not.toHaveClass('opacity-0');
      expect(row).not.toHaveClass('animate-fade-in');
    });
  });
});
