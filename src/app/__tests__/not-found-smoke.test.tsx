import React from 'react';
import { render } from '@testing-library/react';
import NotFound, { metadata } from '@/app/not-found';

jest.mock('@/layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

describe('NotFound', () => {
  it('renders 404 page within layout', () => {
    const { getByText, getByTestId } = render(<NotFound />);
    expect(getByTestId('layout')).toBeInTheDocument();
    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('Page Not Found')).toBeInTheDocument();
  });

  it('uses its own title and a single noindex directive', () => {
    expect(metadata.title).toBe('Page not found | Animesh Pandey');
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBeNull();
  });
});
