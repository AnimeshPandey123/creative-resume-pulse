import React from 'react';
import { render, screen } from '@testing-library/react';
import LatestWriting from '../LatestWriting';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

jest.mock('@/data/landingData', () => ({
  blogSectionData: {
    title: 'Latest Writing',
    subtitle: 'Test blog subtitle',
    limit: 2,
    viewAllText: 'Read all posts',
  },
}));

jest.mock('@/data/mockBlogData', () => ({
  blogPosts: [
    {
      id: '1',
      title: 'Test Post One',
      slug: 'test-post-one',
      excerpt: 'First excerpt',
      coverImage: 'https://example.com/one.jpg',
      publishDate: '2025-01-01',
      readingTime: 5,
      tags: [{ id: 't1', name: 'Node.js', slug: 'node-js' }],
      author: {
        id: 'a1',
        name: 'Animesh Pandey',
        bio: '',
        avatarUrl: '',
      },
    },
    {
      id: '2',
      title: 'Test Post Two',
      slug: 'test-post-two',
      excerpt: 'Second excerpt',
      coverImage: 'https://example.com/two.jpg',
      publishDate: '2025-02-01',
      readingTime: 3,
      tags: [{ id: 't2', name: 'Python', slug: 'python' }],
      author: {
        id: 'a1',
        name: 'Animesh Pandey',
        bio: '',
        avatarUrl: '',
      },
    },
  ],
}));

describe('LatestWriting', () => {
  it('renders latest writing section with posts', () => {
    render(<LatestWriting />);

    expect(
      screen.getByRole('region', { name: /latest writing/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Test blog subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Post One')).toBeInTheDocument();
    expect(screen.getByText('Test Post Two')).toBeInTheDocument();
    expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
  });

  it('renders link to full blog', () => {
    render(<LatestWriting />);

    const link = screen.getByRole('link', { name: /read all posts/i });
    expect(link).toHaveAttribute('href', '/blog');
  });
});
