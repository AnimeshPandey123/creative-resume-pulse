import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import BlogPagination from '@/components/blog/BlogPagination'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams('page=2'),
}))

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children, className }: any) => <nav data-testid="pagination" className={className}>{children}</nav>,
  PaginationContent: ({ children }: any) => <div>{children}</div>,
  PaginationItem: ({ children }: any) => <span>{children}</span>,
  PaginationLink: ({ children, onClick, className, isActive }: any) => <button aria-pressed={!!isActive} className={className} onClick={onClick}>{children}</button>,
  PaginationNext: ({ onClick, className }: any) => <button aria-label="Next" className={className} onClick={onClick}>{'>'}</button>,
  PaginationPrevious: ({ onClick, className }: any) => <button aria-label="Prev" className={className} onClick={onClick}>{'<'}</button>,
  PaginationEllipsis: () => <span>…</span>,
}))

describe('BlogPagination', () => {
  it('renders pages and allows navigation', () => {
    const { getByText, getByLabelText } = render(<BlogPagination totalPages={5} currentPage={2} />)
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Next'))
    fireEvent.click(getByLabelText('Prev'))
  })
})

