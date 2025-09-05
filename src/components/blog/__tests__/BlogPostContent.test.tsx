import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPostContent from '../BlogPostContent';
import { BlogPost } from '@/types/BlogTypes';

// Mock Next.js components
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

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock ReactMarkdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

// Mock CodeBlock component
jest.mock('../CodeBlock', () => {
  return function MockCodeBlock({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return <pre className={className}>{children}</pre>;
  };
});

// Mock UI components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
}));

const mockBlogPost: BlogPost = {
  id: '1',
  title: 'Test Blog Post',
  excerpt: 'This is a test blog post excerpt',
  content: '# Test Content\n\nThis is test markdown content.',
  slug: 'test-blog-post',
  publishDate: '2024-01-01',
  readingTime: 5,
  tags: [
    { id: '1', name: 'test', slug: 'test' },
    { id: '2', name: 'blog', slug: 'blog' },
  ],
  coverImage: '/test-image.jpg',
  author: {
    id: 'test-author',
    name: 'Test Author',
    avatarUrl: '/test-avatar.jpg',
    bio: 'Test author bio',
  },
};

describe('BlogPostContent', () => {
  it('should render blog post content correctly', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('should render cover image with correct attributes', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    const coverImage = screen.getByAltText('Cover image for Test Blog Post');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should render tags correctly', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    // Check that badge elements are rendered (tags are rendered as badges)
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(2);
  });

  it('should render author avatar', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-image')).toHaveAttribute(
      'alt',
      'Test Author'
    );
  });

  it('should render markdown content', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-content')).toHaveTextContent(
      '# Test Content'
    );
  });

  it('should render publish date and read time', () => {
    render(<BlogPostContent post={mockBlogPost} />);

    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<BlogPostContent post={mockBlogPost} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('max-w-3xl', 'mx-auto');
  });
});
