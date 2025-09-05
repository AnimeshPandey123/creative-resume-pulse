import React from 'react';
import { render, screen } from '@testing-library/react';
import Experience from '../Experience';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  experienceData: {
    title: 'Experience',
    items: [
      {
        title: 'Software Engineer',
        company: 'Test Company',
        period: '2020-2023',
        description: 'Test description',
        technologies: ['React', 'TypeScript'],
        responsibilities: ['Responsibility 1', 'Responsibility 2'],
      },
    ],
  },
}));

describe('Experience', () => {
  it('renders experience section with correct content', () => {
    render(<Experience />);

    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('2020-2023')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 1')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 2')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Experience />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-accent/50');
  });
});
