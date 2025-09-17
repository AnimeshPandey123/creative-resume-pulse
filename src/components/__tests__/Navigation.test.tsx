import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '../Navigation';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

// Mock Next.js components and hooks
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
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
    // Reset mocks
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/');
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

  it('should close mobile menu when clicking on blog link', () => {
    render(<Navigation />);

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Verify menu is open
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();

    // Get mobile menu blog link (second instance)
    const mobileBlogLink = screen.getAllByText('Blog')[1];

    // Simulate clicking on mobile blog link
    fireEvent.click(mobileBlogLink);

    // Menu should be closed
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('should render moon icon when theme is light', () => {
    render(<Navigation />);

    const moonIcons = screen.getAllByTestId('moon-icon');
    expect(moonIcons).toHaveLength(2); // Desktop and mobile
  });

  it('should handle theme toggle from mobile menu', () => {
    render(<Navigation />);

    // Get mobile theme button (second instance)
    const mobileThemeButton = screen.getAllByRole('button', {
      name: /switch to dark mode/i,
    })[1];

    fireEvent.click(mobileThemeButton);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('should handle section links on different pages', () => {
    // Mock being on a different page
    (usePathname as jest.Mock).mockReturnValue('/blog');

    render(<Navigation />);

    // Check that section links have correct hrefs when not on homepage
    const aboutLinks = screen.getAllByText('About');
    expect(aboutLinks[0]).toHaveAttribute('href', '/#about');
  });

  it('should test section navigation handler directly', () => {
    // Mock being on a different page
    (usePathname as jest.Mock).mockReturnValue('/blog');

    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<Navigation />);

    // Find the section link and simulate click with preventDefault
    const aboutLink = screen.getAllByText('About')[0];
    const event = new (global as any).MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'preventDefault', {
      value: jest.fn(),
    });

    // Dispatch the event
    aboutLink.dispatchEvent(event);

    // The href should be set correctly for non-homepage
    expect(aboutLink).toHaveAttribute('href', '/#about');
  });

  it('should handle mobile menu section link clicks', () => {
    render(<Navigation />);

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Verify menu is open
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();

    // Get mobile menu about link (second instance)
    const mobileAboutLink = screen.getAllByText('About')[1];

    // Simulate clicking on mobile section link
    fireEvent.click(mobileAboutLink);

    // Menu should be closed
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('should render mobile theme toggle with correct aria-label when theme is dark', () => {
    // Mock dark theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<Navigation />);

    // Get mobile theme button (second instance)
    const mobileThemeButton = screen.getAllByRole('button', {
      name: /switch to light mode/i,
    })[1];

    expect(mobileThemeButton).toHaveAttribute(
      'aria-label',
      'Switch to light mode'
    );
  });
});
