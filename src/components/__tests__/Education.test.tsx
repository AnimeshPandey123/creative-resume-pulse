import React from 'react';
import { render, screen } from '@testing-library/react';
import Education from '../Education';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  educationData: {
    title: 'Education',
    items: [
      {
        degree: 'Bachelor of Science',
        school: 'Test University',
        year: '2020',
        description: 'Test description',
      },
    ],
  },
}));

describe('Education', () => {
  it('renders education section with correct content', () => {
    render(<Education />);

    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Education />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-white');
  });
});
