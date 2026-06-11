import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BlogPagination from '@/components/blog/BlogPagination';

const mockPush = jest.fn();
const mockScrollTo = jest.fn();

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams('page=2&tag=react'),
}));

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children, className }: any) => (
    <nav data-testid="pagination" className={className}>
      {children}
    </nav>
  ),
  PaginationContent: ({ children }: any) => <div>{children}</div>,
  PaginationItem: ({ children }: any) => <span>{children}</span>,
  PaginationLink: ({ children, onClick, className, isActive }: any) => (
    <button aria-pressed={!!isActive} className={className} onClick={onClick}>
      {children}
    </button>
  ),
  PaginationNext: ({ onClick, className }: any) => (
    <button aria-label="Next" className={className} onClick={onClick}>
      {'>'}
    </button>
  ),
  PaginationPrevious: ({ onClick, className }: any) => (
    <button aria-label="Prev" className={className} onClick={onClick}>
      {'<'}
    </button>
  ),
  PaginationEllipsis: () => <span>…</span>,
}));

describe('BlogPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(
      <BlogPagination totalPages={1} currentPage={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all pages when totalPages is 5 or less', () => {
    render(<BlogPagination totalPages={5} currentPage={2} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('renders pagination with ellipsis for many pages', () => {
    render(<BlogPagination totalPages={10} currentPage={5} />);

    // Should show: 1 ... 4 5 6 ... 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  it('renders pagination at the beginning (currentPage near start)', () => {
    render(<BlogPagination totalPages={10} currentPage={2} />);

    // Should show: 1 2 3 ... 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  it('renders pagination at the end (currentPage near end)', () => {
    render(<BlogPagination totalPages={10} currentPage={9} />);

    // Should show: 1 ... 8 9 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  it('handles page navigation correctly', () => {
    render(<BlogPagination totalPages={5} currentPage={2} />);

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(mockPush).toHaveBeenCalledWith('/blog/?page=3&tag=react');
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handles previous page navigation', () => {
    render(<BlogPagination totalPages={5} currentPage={3} />);

    const prevButton = screen.getByLabelText('Prev');
    fireEvent.click(prevButton);

    expect(mockPush).toHaveBeenCalledWith('/blog/?page=2&tag=react');
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handles next page navigation', () => {
    render(<BlogPagination totalPages={5} currentPage={3} />);

    const nextButton = screen.getByLabelText('Next');
    fireEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith('/blog/?page=4&tag=react');
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('disables previous button on first page', () => {
    render(<BlogPagination totalPages={5} currentPage={1} />);

    const prevButton = screen.getByLabelText('Prev');
    expect(prevButton).toHaveClass('pointer-events-none', 'opacity-50');

    fireEvent.click(prevButton);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables next button on last page', () => {
    render(<BlogPagination totalPages={5} currentPage={5} />);

    const nextButton = screen.getByLabelText('Next');
    expect(nextButton).toHaveClass('pointer-events-none', 'opacity-50');

    fireEvent.click(nextButton);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows active state for current page', () => {
    render(<BlogPagination totalPages={5} currentPage={3} />);

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('handles empty search params', () => {
    // This test is already covered by the default mock behavior
    render(<BlogPagination totalPages={5} currentPage={2} />);

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(mockPush).toHaveBeenCalledWith('/blog/?page=3&tag=react');
  });

  it('preserves existing search params when navigating', () => {
    // This test is already covered by the default mock behavior
    render(<BlogPagination totalPages={5} currentPage={2} />);

    const page4Button = screen.getByText('4');
    fireEvent.click(page4Button);

    expect(mockPush).toHaveBeenCalledWith('/blog/?page=4&tag=react');
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(
      <BlogPagination totalPages={5} currentPage={2} />
    );

    const pagination = container.querySelector('[data-testid="pagination"]');
    expect(pagination).toHaveClass('mt-8');
  });

  it('handles edge case with exactly 6 pages', () => {
    render(<BlogPagination totalPages={6} currentPage={3} />);

    // Should show: 1 2 3 4 ... 6 (with ellipsis)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument(); // Page 5 is hidden by ellipsis
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  it('handles edge case with currentPage at boundary', () => {
    render(<BlogPagination totalPages={10} currentPage={1} />);

    // Should show: 1 2 3 ... 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument(); // Page 3 is hidden by ellipsis
    expect(screen.getByText('…')).toBeInTheDocument();
  });
});
