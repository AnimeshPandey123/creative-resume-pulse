import React from 'react';
import { render } from '@testing-library/react';
import NotFound from '@/app/not-found';

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
});
