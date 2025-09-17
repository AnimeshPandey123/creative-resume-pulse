import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPageClient from '@/components/blog/BlogPageClient';

// Mock the blog data
jest.mock('@/data/mockBlogData', () => ({
  fetchBlogPosts: jest.fn(),
  blogTags: [
    { id: 1, name: 'React', slug: 'react' },
    { id: 2, name: 'Python', slug: 'python' },
    { id: 3, name: 'JavaScript', slug: 'javascript' },
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
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

describe('BlogPageClient', () => {
  const mockFetchBlogPosts = require('@/data/mockBlogData').fetchBlogPosts;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1'));
  });

  it('renders blog page with posts', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [
        { id: 1, title: 'Test Post 1' },
        { id: 2, title: 'Test Post 2' },
      ],
      totalPages: 2,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(
      screen.getByText('Thoughts, ideas, and tutorials to inspire and inform')
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('blog-post-card')).toHaveLength(2);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders empty state when no posts found', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [],
      totalPages: 0,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(screen.getByText('No posts found')).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your search term or removing filters.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('blog-post-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('displays tag-specific description when valid tag is provided', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=react'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'React Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(
      screen.getByText('Exploring articles about React')
    ).toBeInTheDocument();
  });

  it('displays tag slug as fallback when tag is not found in blogTags', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=unknown-tag'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Unknown Tag Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(
      screen.getByText('Exploring articles about unknown-tag')
    ).toBeInTheDocument();
  });

  it('displays default description when no tag is provided', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Default Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(
      screen.getByText('Thoughts, ideas, and tutorials to inspire and inform')
    ).toBeInTheDocument();
  });

  it('handles different search parameters correctly', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=2&search=test&tag=python')
    );
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Python Test Post' }],
      totalPages: 3,
      currentPage: 2,
    });

    render(<BlogPageClient />);

    expect(
      screen.getByText('Exploring articles about Python')
    ).toBeInTheDocument();
    expect(mockFetchBlogPosts).toHaveBeenCalledWith(2, 6, 'test', 'python');
  });

  it('handles invalid page parameter gracefully', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=invalid'));
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Default Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(mockFetchBlogPosts).toHaveBeenCalledWith(1, 6, '', '');
  });

  it('renders RSS feed link', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Test Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    const rssLink = screen.getByText('RSS Feed').closest('a');
    expect(rssLink).toHaveAttribute('href', '/feed.xml');
    expect(rssLink).toHaveAttribute('title', 'Subscribe to RSS feed');
  });

  it('renders search and tag filter components', () => {
    mockFetchBlogPosts.mockReturnValue({
      posts: [{ id: 1, title: 'Test Post' }],
      totalPages: 1,
      currentPage: 1,
    });

    render(<BlogPageClient />);

    expect(screen.getByTestId('blog-search')).toBeInTheDocument();
    expect(screen.getByTestId('blog-tag-filter')).toBeInTheDocument();
  });
});
