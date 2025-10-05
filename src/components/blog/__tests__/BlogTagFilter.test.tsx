import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BlogTagFilter from '@/components/blog/BlogTagFilter';

// Mock the blog tags data
jest.mock('@/data/mockBlogData', () => ({
  blogTags: [
    { id: '1', name: 'React', slug: 'react' },
    { id: '2', name: 'Python', slug: 'python' },
    { id: '3', name: 'JavaScript', slug: 'javascript' },
    { id: '4', name: 'TypeScript', slug: 'typescript' },
  ],
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
  });

  it('renders with default state (no tag selected)', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Filter by tag');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens popover when clicked', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('displays all available tags in the dropdown', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('selects a tag and calls onTagChange', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(mockOnTagChange).toHaveBeenCalledWith('react');
  });

  it('clears tag filter when same tag is selected again', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'react',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getAllByText('React')[1]; // Get the option, not the button
    fireEvent.click(reactOption);

    expect(mockOnTagChange).toHaveBeenCalledWith('');
  });

  it('shows selected tag in button text', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'python',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Python');
  });

  it('shows clear filter button when tag is selected', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'javascript',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const clearButton = screen.getByText('Clear filter');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear filter button when no tag is selected', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    expect(screen.queryByText('Clear filter')).not.toBeInTheDocument();
  });

  it('clears filter when clear button is clicked', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'typescript',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const clearButton = screen.getByText('Clear filter');
    fireEvent.click(clearButton);

    expect(mockOnTagChange).toHaveBeenCalledWith('');
  });

  it('calls onTagChange when selecting tag', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const pythonOption = screen.getByText('Python');
    fireEvent.click(pythonOption);

    expect(mockOnTagChange).toHaveBeenCalledWith('python');
  });

  it('calls onTagChange when changing tags', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'react',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const pythonOption = screen.getByText('Python');
    fireEvent.click(pythonOption);

    expect(mockOnTagChange).toHaveBeenCalledWith('python');
  });

  it('calls onTagChange when selecting tag with empty search params', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: mockOnTagChange,
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(mockOnTagChange).toHaveBeenCalledWith('react');
  });

  it('closes popover after selecting a tag', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('has correct CSS classes for selected tag', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'react',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveClass(
      'bg-primary/10',
      'dark:bg-primary/20',
      'border-primary/30',
      'dark:border-primary/30'
    );
  });

  it('has correct CSS classes for unselected state', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    expect(button).toHaveClass(
      'bg-white/50',
      'dark:bg-gray-800/50',
      'border-white/20',
      'dark:border-gray-700/30'
    );
  });

  it('shows search input in dropdown', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search tags...');
    expect(searchInput).toBeInTheDocument();
  });

  it('shows empty state when no tags match search', () => {
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: jest.fn(),
    };
    render(<BlogTagFilter {...mockProps} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search tags...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No tag found.')).toBeInTheDocument();
  });

  it('updates value state when selectedTag prop changes', () => {
    const mockOnTagChange = jest.fn();
    const mockProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: '',
      onTagChange: mockOnTagChange,
    };
    const { rerender } = render(<BlogTagFilter {...mockProps} />);

    let button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Filter by tag');

    // Update props to include selected tag
    const updatedProps = {
      tags: [
        { id: '1', name: 'React', slug: 'react' },
        { id: '2', name: 'Python', slug: 'python' },
        { id: '3', name: 'JavaScript', slug: 'javascript' },
        { id: '4', name: 'TypeScript', slug: 'typescript' },
      ],
      selectedTag: 'python',
      onTagChange: mockOnTagChange,
    };
    rerender(<BlogTagFilter {...updatedProps} />);

    button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Python');
  });
});
