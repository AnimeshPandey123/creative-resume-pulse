import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPageClient from '@/components/blog/BlogPageClient';

// Mock the blog data
jest.mock('@/data/mockBlogData', () => ({
  fetchBlogPosts: jest.fn(),
  blogTags: [
    { id: '1', name: 'React', slug: 'react' },
    { id: '2', name: 'Python', slug: 'python' },
    { id: '3', name: 'JavaScript', slug: 'javascript' },
  ],
}));

// Mock child components
jest.mock('@/components/blog/BlogSearch', () => ({
  __esModule: true,
  default: () => <div data-testid="blog-search" />,
}));
jest.mock('@/components/blog/BlogTagFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="blog-tag-filter" />,
}));
jest.mock('@/components/blog/BlogPostCard', () => ({
  __esModule: true,
  default: ({ post }: any) => (
    <div data-testid="blog-post-card">{post.title}</div>
  ),
}));
jest.mock('@/components/blog/BlogPagination', () => ({
  __esModule: true,
  default: ({ totalPages, currentPage }: any) => (
    <div data-testid="pagination">
      {currentPage}/{totalPages}
    </div>
  ),
}));

// Mock next/navigation
const mockUseSearchParams = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => ({ push: mockPush }),
}));

describe('BlogPageClient', () => {
  const mockFetchBlogPosts = require('@/data/mockBlogData').fetchBlogPosts;

  const mockAuthor = {
    id: '1',
    name: 'Test Author',
    bio: 'Test bio',
    avatarUrl: '/avatar.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1'));
  });

  it('renders blog page with posts', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [
        { id: '1', title: 'Test Post 1' },
        { id: '2', title: 'Test Post 2' },
      ],
      totalPages: 2,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          excerpt: 'Test excerpt 1',
          coverImage: '/test-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 5,
          author: mockAuthor,
          tags: [{ id: '1', name: 'React', slug: 'react' }],
        },
        {
          id: '2',
          title: 'Test Post 2',
          slug: 'test-post-2',
          excerpt: 'Test excerpt 2',
          coverImage: '/test-image2.jpg',
          publishDate: '2024-01-02',
          readingTime: 3,
          author: mockAuthor,
          tags: [{ id: '2', name: 'Python', slug: 'python' }],
        },
      ],
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
      ],
      stats: { totalPosts: 2, totalTags: 2 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByText('Engineering Blog')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Practical notes on backend systems, full-stack development, DevOps, and AI integration.'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('blog-post-card')).toHaveLength(2);
  });

  it('renders empty state when no posts found', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [],
      totalPages: 0,
      currentPage: 1,
    });

    const mockProps = {
      posts: [],
      tags: [],
      stats: { totalPosts: 0, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByText('No posts found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Try adjusting your search term or removing filters to browse all articles.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('blog-post-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('displays tag-specific description when valid tag is provided', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=react'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'React Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'React Post',
          slug: 'react-post',
          excerpt: 'React post excerpt',
          coverImage: '/react-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 4,
          author: mockAuthor,
          tags: [{ id: '1', name: 'React', slug: 'react' }],
        },
      ],
      tags: [{ id: '1', name: 'React', slug: 'react' }],
      stats: { totalPosts: 1, totalTags: 1 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByText('Articles about React')).toBeInTheDocument();
  });

  it('displays tag slug as fallback when tag is not found in blogTags', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=unknown-tag'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Unknown Tag Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Unknown Tag Post',
          slug: 'unknown-tag-post',
          excerpt: 'Unknown tag post excerpt',
          coverImage: '/unknown-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 2,
          author: mockAuthor,
          tags: [],
        },
      ],
      tags: [],
      stats: { totalPosts: 1, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByText('Articles about unknown-tag')).toBeInTheDocument();
  });

  it('displays default description when no tag is provided', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Default Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Default Post',
          slug: 'default-post',
          excerpt: 'Default post excerpt',
          coverImage: '/default-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 3,
          author: mockAuthor,
          tags: [],
        },
      ],
      tags: [],
      stats: { totalPosts: 1, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(
      screen.getByText(
        'Practical notes on backend systems, full-stack development, DevOps, and AI integration.'
      )
    ).toBeInTheDocument();
  });

  it('handles different search parameters correctly', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=2&search=test&tag=python')
    );
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Python Test Post' }],
      totalPages: 3,
      currentPage: 2,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Python Test Post',
          slug: 'python-test-post',
          excerpt: 'Python test post excerpt',
          coverImage: '/python-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 6,
          author: mockAuthor,
          tags: [{ id: '2', name: 'Python', slug: 'python' }],
        },
      ],
      tags: [{ id: '2', name: 'Python', slug: 'python' }],
      stats: { totalPosts: 1, totalTags: 1 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByText('Articles about Python')).toBeInTheDocument();
  });

  it('handles invalid page parameter gracefully', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=invalid'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Default Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Default Post',
          slug: 'default-post',
          excerpt: 'Default post excerpt',
          coverImage: '/default-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 3,
          author: mockAuthor,
          tags: [],
        },
      ],
      tags: [],
      stats: { totalPosts: 1, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    // Component renders successfully without calling fetchBlogPosts
  });

  it('renders RSS feed link', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Test Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test post excerpt',
          coverImage: '/test-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 4,
          author: mockAuthor,
          tags: [],
        },
      ],
      tags: [],
      stats: { totalPosts: 1, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    const rssLink = screen.getByText('RSS Feed').closest('a');
    expect(rssLink).toHaveAttribute('href', '/feed.xml');
    expect(rssLink).toHaveAttribute('title', 'Subscribe to RSS feed');
  });

  it('renders search and tag filter components', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: '1', title: 'Test Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    const mockProps = {
      posts: [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test post excerpt',
          coverImage: '/test-image.jpg',
          publishDate: '2024-01-01',
          readingTime: 4,
          author: mockAuthor,
          tags: [],
        },
      ],
      tags: [],
      stats: { totalPosts: 1, totalTags: 0 },
    };

    render(<BlogPageClient {...mockProps} />);

    expect(screen.getByTestId('blog-search')).toBeInTheDocument();
    expect(screen.getByTestId('blog-tag-filter')).toBeInTheDocument();
  });
});
