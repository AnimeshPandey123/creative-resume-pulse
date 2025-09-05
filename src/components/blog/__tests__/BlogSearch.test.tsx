import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import BlogSearch from '@/components/blog/BlogSearch';

const push = jest.fn();
let mockSearchParams: URLSearchParams;

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('BlogSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams('');
  });

  it('updates query param on input change', () => {
    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(push).toHaveBeenCalledWith('/blog?search=abc&page=1');
  });

  it('clears search param when input is empty', () => {
    // First set a search param
    mockSearchParams.set('search', 'test');
    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Clear the input
    fireEvent.change(input, { target: { value: '' } });
    expect(push).toHaveBeenCalledWith('/blog?page=1');
  });

  it('initializes with search param from URL', () => {
    mockSearchParams.set('search', 'initial-search');
    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    expect(input.value).toBe('initial-search');
  });

  it('initializes with empty value when no search param', () => {
    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates search term when search params change', () => {
    // Start with empty search params
    const { getByPlaceholderText, rerender } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Initially empty
    expect(input.value).toBe('');

    // Update search params and rerender with new params
    mockSearchParams = new URLSearchParams('search=new-search');
    rerender(<BlogSearch />);

    expect(input.value).toBe('new-search');
  });

  it('preserves other query params when updating search', () => {
    mockSearchParams.set('category', 'tech');
    mockSearchParams.set('tag', 'react');

    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'new-search' } });
    expect(push).toHaveBeenCalledWith(
      '/blog?category=tech&tag=react&search=new-search&page=1'
    );
  });

  it('removes search param and preserves others when clearing search', () => {
    mockSearchParams.set('search', 'old-search');
    mockSearchParams.set('category', 'tech');
    mockSearchParams.set('tag', 'react');

    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    expect(push).toHaveBeenCalledWith('/blog?category=tech&tag=react&page=1');
  });

  it('handles null searchParams gracefully', () => {
    // Set mockSearchParams to null to test the ternary operator
    mockSearchParams = null as any;

    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;

    // Should handle null searchParams without crashing
    fireEvent.change(input, { target: { value: 'test' } });
    expect(push).toHaveBeenCalledWith('/blog?search=test&page=1');
  });
});
