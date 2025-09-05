import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import BlogSearch from '@/components/blog/BlogSearch';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(''),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('BlogSearch', () => {
  it('updates query param on input change', () => {
    const { getByPlaceholderText } = render(<BlogSearch />);
    const input = getByPlaceholderText(
      'Search blog posts...'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(push).toHaveBeenCalled();
  });
});
