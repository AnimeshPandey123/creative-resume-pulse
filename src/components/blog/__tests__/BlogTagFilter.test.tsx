import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BlogTagFilter from '@/components/blog/BlogTagFilter';

const mockPush = jest.fn();
const mockUseSearchParams = jest.fn();

// Mock the blog tags data
jest.mock('@/data/mockBlogData', () => ({
  blogTags: [
    { id: 1, name: 'React', slug: 'react' },
    { id: 2, name: 'Python', slug: 'python' },
    { id: 3, name: 'JavaScript', slug: 'javascript' },
    { id: 4, name: 'TypeScript', slug: 'typescript' },
  ],
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: (props: any) => <button {...props} />,
}));
jest.mock('@/components/ui/command', () => ({
  Command: ({ children, value }: any) => (
    <div data-value={value}>{children}</div>
  ),
  CommandEmpty: ({ children }: any) => <div>{children}</div>,
  CommandGroup: ({ children }: any) => <div>{children}</div>,
  CommandInput: ({ ...props }: any) => <input {...props} />,
  CommandItem: ({ children, onSelect, value }: any) => (
    <div role="option" aria-selected={false} onClick={() => onSelect(value)}>
      {children}
    </div>
  ),
  CommandList: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open, onOpenChange }: any) => (
    <div data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

describe('BlogTagFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
  });

  it('renders with default state (no tag selected)', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Filter by tag');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens popover when clicked', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('displays all available tags in the dropdown', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('selects a tag and updates URL', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(mockPush).toHaveBeenCalledWith('/blog?tag=react&page=1');
  });

  it('clears tag filter when same tag is selected again', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=react'));

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getAllByText('React')[1]; // Get the option, not the button
    fireEvent.click(reactOption);

    expect(mockPush).toHaveBeenCalledWith('/blog?page=1');
  });

  it('shows selected tag in button text', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=python'));

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Python');
  });

  it('shows clear filter button when tag is selected', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=javascript'));

    render(<BlogTagFilter />);

    const clearButton = screen.getByText('Clear filter');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear filter button when no tag is selected', () => {
    render(<BlogTagFilter />);

    expect(screen.queryByText('Clear filter')).not.toBeInTheDocument();
  });

  it('clears filter when clear button is clicked', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=typescript'));

    render(<BlogTagFilter />);

    const clearButton = screen.getByText('Clear filter');
    fireEvent.click(clearButton);

    expect(mockPush).toHaveBeenCalledWith('/blog?');
  });

  it('preserves existing search params when selecting tag', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=2&search=test')
    );

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const pythonOption = screen.getByText('Python');
    fireEvent.click(pythonOption);

    expect(mockPush).toHaveBeenCalledWith(
      '/blog?page=1&search=test&tag=python'
    );
  });

  it('resets to page 1 when changing tags', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=3&tag=react')
    );

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const pythonOption = screen.getByText('Python');
    fireEvent.click(pythonOption);

    expect(mockPush).toHaveBeenCalledWith('/blog?page=1&tag=python');
  });

  it('handles empty search params', () => {
    mockUseSearchParams.mockReturnValue(null);

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(mockPush).toHaveBeenCalledWith('/blog?tag=react&page=1');
  });

  it('closes popover after selecting a tag', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('has correct CSS classes for selected tag', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=react'));

    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveClass(
      'bg-primary/10',
      'dark:bg-primary/20',
      'border-primary/30',
      'dark:border-primary/30'
    );
  });

  it('has correct CSS classes for unselected state', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveClass(
      'bg-white/50',
      'dark:bg-gray-800/50',
      'border-white/20',
      'dark:border-gray-700/30'
    );
  });

  it('shows search input in dropdown', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search tags...');
    expect(searchInput).toBeInTheDocument();
  });

  it('shows empty state when no tags match search', () => {
    render(<BlogTagFilter />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search tags...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No tag found.')).toBeInTheDocument();
  });

  it('updates value state when URL params change', () => {
    // Initially no tag selected
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    const { rerender } = render(<BlogTagFilter />);

    let button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Filter by tag');

    // Mock URL change to include tag
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tag=python'));
    rerender(<BlogTagFilter />);

    button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Python');
  });
});
