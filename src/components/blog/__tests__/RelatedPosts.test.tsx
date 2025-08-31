import React from 'react'
import { render } from '@testing-library/react'
import RelatedPosts from '@/components/blog/RelatedPosts'

jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }))
jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img alt={props.alt} src={props.src} /> }))
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div data-testid="card-content" className={className}>{children}</div>,
}))

const post = {
  id: '1', title: 'Rel Post', slug: 'rel', excerpt: '', content: '', coverImage: '/c.jpg', publishDate: '2024-01-01', readingTime: 1,
  author: { id: 'a', name: 'A', bio: '', avatarUrl: '' },
  tags: [],
}

describe('RelatedPosts', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<RelatedPosts posts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders cards for posts', () => {
    const { getByText, getAllByTestId } = render(<RelatedPosts posts={[post as any]} />)
    expect(getByText('Related Posts')).toBeInTheDocument()
    expect(getAllByTestId('card').length).toBe(1)
  })
})

