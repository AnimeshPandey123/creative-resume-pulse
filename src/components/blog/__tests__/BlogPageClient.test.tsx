import React from 'react';
import { render } from '@testing-library/react';
import BlogPageClient from '@/components/blog/BlogPageClient';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
}));

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

describe('BlogPageClient', () => {
  it('renders list and pagination', () => {
    const { getByText, getAllByTestId } = render(<BlogPageClient />);
    expect(getByText('Blog')).toBeInTheDocument();
    expect(getAllByTestId('blog-post-card').length).toBeGreaterThan(0);
    expect(getAllByTestId('pagination')[0]).toBeInTheDocument();
  });
});
