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

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockDynamicMermaid({ chart }: { chart: string }) {
      return <div data-testid="mermaid-diagram">{chart}</div>;
    },
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

jest.mock('../CodeBlock', () => {
  return function MockCodeBlock({ children }: { children: React.ReactNode }) {
    return <pre>{children}</pre>;
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
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
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

    expect(screen.getByText('1 January 2024')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<BlogPostContent post={mockBlogPost} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('max-w-3xl', 'mx-auto');
  });

  it('should handle empty content gracefully', () => {
    const postWithEmptyContent = {
      ...mockBlogPost,
      content: '',
    };

    render(<BlogPostContent post={postWithEmptyContent} />);

    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });

  it('should handle undefined content gracefully', () => {
    const postWithUndefinedContent = {
      ...mockBlogPost,
      content: undefined,
    };

    render(<BlogPostContent post={postWithUndefinedContent} />);

    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });

  it('should handle empty tags array', () => {
    const postWithNoTags = {
      ...mockBlogPost,
      tags: [],
    };

    render(<BlogPostContent post={postWithNoTags} />);

    const badges = screen.queryAllByTestId('badge');
    expect(badges).toHaveLength(0);
  });

  it('should handle author with empty name for avatar fallback', () => {
    const postWithEmptyAuthorName = {
      ...mockBlogPost,
      author: {
        ...mockBlogPost.author,
        name: '',
      },
    };

    render(<BlogPostContent post={postWithEmptyAuthorName} />);

    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('');
  });

  it('should handle author with single character name', () => {
    const postWithSingleCharAuthor = {
      ...mockBlogPost,
      author: {
        ...mockBlogPost.author,
        name: 'A',
      },
    };

    render(<BlogPostContent post={postWithSingleCharAuthor} />);

    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('A');
  });

  it('should handle author with long name for avatar fallback', () => {
    const postWithLongAuthorName = {
      ...mockBlogPost,
      author: {
        ...mockBlogPost.author,
        name: 'Very Long Author Name',
      },
    };

    render(<BlogPostContent post={postWithLongAuthorName} />);

    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('V');
  });

  it('should handle missing cover image gracefully', () => {
    const postWithoutCoverImage = {
      ...mockBlogPost,
      coverImage: '',
    };

    render(<BlogPostContent post={postWithoutCoverImage} />);

    const coverImage = screen.getByAltText('Cover image for Test Blog Post');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', '');
  });

  it('should handle missing author avatar URL', () => {
    const postWithoutAuthorAvatar = {
      ...mockBlogPost,
      author: {
        ...mockBlogPost.author,
        avatarUrl: '',
      },
    };

    render(<BlogPostContent post={postWithoutAuthorAvatar} />);

    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', '');
    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
  });

  it('should handle missing author bio', () => {
    const postWithoutAuthorBio = {
      ...mockBlogPost,
      author: {
        ...mockBlogPost.author,
        bio: '',
      },
    };

    render(<BlogPostContent post={postWithoutAuthorBio} />);

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    // Bio should still be rendered but empty
    const authorSection = screen.getByText('Test Author').closest('div');
    expect(authorSection).toBeInTheDocument();
  });

  it('should handle zero reading time', () => {
    const postWithZeroReadingTime = {
      ...mockBlogPost,
      readingTime: 0,
    };

    render(<BlogPostContent post={postWithZeroReadingTime} />);

    expect(screen.getByText('0 min read')).toBeInTheDocument();
  });

  it('should handle very long reading time', () => {
    const postWithLongReadingTime = {
      ...mockBlogPost,
      readingTime: 999,
    };

    render(<BlogPostContent post={postWithLongReadingTime} />);

    expect(screen.getByText('999 min read')).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const postWithSpecialChars = {
      ...mockBlogPost,
      title: 'Test & "Special" Characters < > &',
    };

    render(<BlogPostContent post={postWithSpecialChars} />);

    expect(
      screen.getByText('Test & "Special" Characters < > &')
    ).toBeInTheDocument();
  });

  it('should handle very long title', () => {
    const longTitle = 'A'.repeat(200);
    const postWithLongTitle = {
      ...mockBlogPost,
      title: longTitle,
    };

    render(<BlogPostContent post={postWithLongTitle} />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should handle empty title', () => {
    const postWithEmptyTitle = {
      ...mockBlogPost,
      title: '',
    };

    render(<BlogPostContent post={postWithEmptyTitle} />);

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('');
  });
});
