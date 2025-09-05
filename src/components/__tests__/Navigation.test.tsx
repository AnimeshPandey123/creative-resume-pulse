import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock Next.js components and hooks
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock the theme provider
const mockToggleTheme = jest.fn();
jest.mock('@/components/ThemeProvider', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  })),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">Close</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  BookOpen: () => <div data-testid="book-icon">Book</div>,
}));

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

describe('Navigation', () => {
  beforeEach(() => {
    // Reset scroll position
    window.scrollY = 0;
  });

  it('should render navigation with all links', () => {
    render(<Navigation />);

    expect(screen.getAllByText('About')).toHaveLength(2); // Desktop and mobile
    expect(screen.getAllByText('Experience')).toHaveLength(2);
    expect(screen.getAllByText('Projects')).toHaveLength(2);
    expect(screen.getAllByText('Skills')).toHaveLength(2);
    expect(screen.getAllByText('Education')).toHaveLength(2);
    expect(screen.getAllByText('Contact')).toHaveLength(2);
    expect(screen.getAllByText('Blog')).toHaveLength(2);
  });

  it('should render mobile menu button', () => {
    render(<Navigation />);

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('should toggle mobile menu when menu button is clicked', () => {
    render(<Navigation />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    render(<Navigation />);

    const themeButtons = screen.getAllByRole('button', {
      name: /switch to dark mode/i,
    });
    expect(themeButtons).toHaveLength(2); // Desktop and mobile
  });

  it('should have correct CSS classes for header', () => {
    const { container } = render(<Navigation />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('should render logo/brand name', () => {
    render(<Navigation />);

    // Assuming there's a brand/logo element
    const brandElement = screen.getByText('Animesh Pandey');
    expect(brandElement).toBeInTheDocument();
  });

  it('should handle scroll events', async () => {
    render(<Navigation />);

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100 });
    fireEvent.scroll(window);

    await waitFor(() => {
      const header = document.querySelector('header');
      expect(header).toHaveClass(
        'bg-white/80',
        'dark:bg-gray-900/90',
        'backdrop-blur-md',
        'shadow-sm'
      );
    });
  });

  it('should close mobile menu when close button is clicked', () => {
    render(<Navigation />);

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Close mobile menu
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('should show scrolled state when window is scrolled', () => {
    render(<Navigation />);

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100,
    });

    // Trigger scroll event
    fireEvent.scroll(window);

    // The header should have scrolled class
    const header = document.querySelector('header');
    expect(header).toHaveClass('backdrop-blur-md', 'bg-white/80');
  });

  it('should handle theme toggle', () => {
    render(<Navigation />);

    const themeButton = screen.getAllByRole('button', {
      name: /switch to dark mode/i,
    })[0];
    fireEvent.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('should close mobile menu when clicking outside', () => {
    render(<Navigation />);

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Click on the overlay to close menu
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (overlay) {
      fireEvent.click(overlay);
    }

    // Menu should be closed - check that close icon is not visible
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('should render navigation links with correct hrefs', () => {
    render(<Navigation />);

    // Use getAllByText to handle multiple instances
    const aboutLinks = screen.getAllByText('About');
    expect(aboutLinks[0]).toHaveAttribute('href', '#about');

    const experienceLinks = screen.getAllByText('Experience');
    expect(experienceLinks[0]).toHaveAttribute('href', '#experience');

    const projectsLinks = screen.getAllByText('Projects');
    expect(projectsLinks[0]).toHaveAttribute('href', '#projects');

    const skillsLinks = screen.getAllByText('Skills');
    expect(skillsLinks[0]).toHaveAttribute('href', '#skills');

    const educationLinks = screen.getAllByText('Education');
    expect(educationLinks[0]).toHaveAttribute('href', '#education');

    const contactLinks = screen.getAllByText('Contact');
    expect(contactLinks[0]).toHaveAttribute('href', '#contact');

    const blogLinks = screen.getAllByText('Blog');
    expect(blogLinks[0]).toHaveAttribute('href', '/blog');
  });
});
