import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AnalyticsButton } from '../analytics-button';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackClick: jest.fn(),
}));

const mockTrackClick = require('@/lib/analytics')
  .trackClick as jest.MockedFunction<any>;

describe('AnalyticsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with children', () => {
    const { getByRole } = render(<AnalyticsButton>Click me</AnalyticsButton>);

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should track click event when elementName is provided', () => {
    const { getByRole } = render(
      <AnalyticsButton elementName="test-button" location="header">
        Click me
      </AnalyticsButton>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockTrackClick).toHaveBeenCalledWith('test-button', 'header');
  });

  it('should not track click event when elementName is not provided', () => {
    const { getByRole } = render(<AnalyticsButton>Click me</AnalyticsButton>);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockTrackClick).not.toHaveBeenCalled();
  });

  it('should call original onClick handler', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <AnalyticsButton elementName="test-button" onClick={handleClick}>
        Click me
      </AnalyticsButton>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
    expect(mockTrackClick).toHaveBeenCalledWith('test-button', undefined);
  });

  it('should apply correct variant classes', () => {
    const { getByRole } = render(
      <AnalyticsButton variant="secondary" size="lg">
        Large Secondary Button
      </AnalyticsButton>
    );

    const button = getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('should work with asChild prop', () => {
    const { getByRole } = render(
      <AnalyticsButton asChild elementName="link-button">
        <a href="/test">Link Button</a>
      </AnalyticsButton>
    );

    const link = getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should track click on child elements when asChild is used', () => {
    const { getByRole } = render(
      <AnalyticsButton asChild elementName="child-button" location="footer">
        <a href="/test">Child Link</a>
      </AnalyticsButton>
    );

    const link = getByRole('link');
    fireEvent.click(link);

    expect(mockTrackClick).toHaveBeenCalledWith('child-button', 'footer');
  });
});
