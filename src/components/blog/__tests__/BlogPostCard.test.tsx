import React from 'react';
import { render } from '@testing-library/react';
import BlogPostCard from '@/components/blog/BlogPostCard';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} src={props.src} />,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardFooter: ({ children, className }: any) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  ),
}));
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

const post = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Short excerpt',
  content: 'content',
  coverImage: '/cover.jpg',
  publishDate: '2024-01-01',
  readingTime: 3,
  author: { id: 'a', name: 'Author', bio: '', avatarUrl: '' },
  tags: [
    { id: 't1', name: 'Tag1', slug: 'tag1' },
    { id: 't2', name: 'Tag2', slug: 'tag2' },
  ],
};

describe('BlogPostCard', () => {
  it('renders basic post data', () => {
    const { getByText, getAllByTestId } = render(
      <BlogPostCard post={post as any} />
    );
    expect(getByText('Test Post')).toBeInTheDocument();
    expect(getByText('Short excerpt')).toBeInTheDocument();
    expect(getAllByTestId('badge').length).toBeGreaterThan(0);
  });
});
