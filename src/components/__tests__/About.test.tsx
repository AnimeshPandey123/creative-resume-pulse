import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock the landing data
jest.mock('@/data/landingData', () => ({
  aboutData: {
    title: 'About Me',
    description: 'Test description',
    image: '/test-image.jpg',
    content: ['Test content paragraph 1', 'Test content paragraph 2'],
    contact: {
      phone: '+1234567890',
      email: 'test@example.com',
    },
  },
}));

describe('About', () => {
  it('renders about section with correct content', () => {
    render(<About />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Test content paragraph 1')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<About />);

    expect(container.firstChild).toHaveClass('py-20', 'bg-white');
  });
});
