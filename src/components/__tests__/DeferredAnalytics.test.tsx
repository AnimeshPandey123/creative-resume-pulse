import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeferredAnalytics from '@/components/DeferredAnalytics';

jest.mock('@/components/Hotjar', () => {
  return function MockHotjar() {
    return <div data-testid="hotjar" />;
  };
});

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => (
    <div data-testid="google-analytics" data-ga-id={gaId} />
  ),
}));

describe('DeferredAnalytics', () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456';
  });

  afterEach(() => {
    if (originalGaId === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGaId;
    }
  });

  it('does not mount analytics until the first interaction', () => {
    render(<DeferredAnalytics />);

    expect(screen.queryByTestId('google-analytics')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hotjar')).not.toBeInTheDocument();
  });

  it('mounts analytics after scroll', async () => {
    render(<DeferredAnalytics />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByTestId('google-analytics')).toBeInTheDocument();
      expect(screen.getByTestId('hotjar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('google-analytics')).toHaveAttribute(
      'data-ga-id',
      'G-TEST123456'
    );
  });
});
