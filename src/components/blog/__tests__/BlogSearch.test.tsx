import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import BlogSearch from '@/components/blog/BlogSearch';

// No router mocks needed since component doesn't use router directly

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('BlogSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSearchChange when input changes', () => {
    const mockOnSearchChange = jest.fn();
    const mockProps = {
      searchTerm: '',
      onSearchChange: mockOnSearchChange,
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('abc');
  });

  it('calls onSearchChange when input is cleared', () => {
    const mockOnSearchChange = jest.fn();
    const mockProps = {
      searchTerm: 'test',
      onSearchChange: mockOnSearchChange,
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Clear the input
    fireEvent.change(input, { target: { value: '' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('initializes with search term from props', () => {
    const mockProps = {
      searchTerm: 'initial-search',
      onSearchChange: jest.fn(),
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    expect(input.value).toBe('initial-search');
  });

  it('initializes with empty value when no search term', () => {
    const mockProps = {
      searchTerm: '',
      onSearchChange: jest.fn(),
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates search term when props change', () => {
    // Start with empty search term
    const mockProps = {
      searchTerm: '',
      onSearchChange: jest.fn(),
    };
    const { getByPlaceholderText, rerender } = render(
      <BlogSearch {...mockProps} />
    );
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Initially empty
    expect(input.value).toBe('');

    // Update props and rerender
    const updatedProps = {
      searchTerm: 'new-search',
      onSearchChange: jest.fn(),
    };
    rerender(<BlogSearch {...updatedProps} />);

    expect(input.value).toBe('new-search');
  });

  it('calls onSearchChange when updating search', () => {
    const mockOnSearchChange = jest.fn();
    const mockProps = {
      searchTerm: '',
      onSearchChange: mockOnSearchChange,
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'new-search' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('new-search');
  });

  it('calls onSearchChange when clearing search', () => {
    const mockOnSearchChange = jest.fn();
    const mockProps = {
      searchTerm: 'old-search',
      onSearchChange: mockOnSearchChange,
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('calls onSearchChange when typing in input', () => {
    const mockOnSearchChange = jest.fn();
    const mockProps = {
      searchTerm: '',
      onSearchChange: mockOnSearchChange,
    };
    const { getByPlaceholderText } = render(<BlogSearch {...mockProps} />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Should call onSearchChange when typing
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('test');
  });
});
