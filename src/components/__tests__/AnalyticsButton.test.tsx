import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AnalyticsButton from '../AnalyticsButton';

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
    const { getByRole } = render(
      <AnalyticsButton elementName="test-button">Click me</AnalyticsButton>
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should track click event when button is clicked', () => {
    const { getByRole } = render(
      <AnalyticsButton elementName="test-button" location="header">
        Click me
      </AnalyticsButton>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockTrackClick).toHaveBeenCalledWith('test-button', 'header');
  });

  it('should track click event without location', () => {
    const { getByRole } = render(
      <AnalyticsButton elementName="footer-link">Footer Link</AnalyticsButton>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockTrackClick).toHaveBeenCalledWith('footer-link', undefined);
  });

  it('should pass through all button props', () => {
    const { getByRole } = render(
      <AnalyticsButton
        elementName="styled-button"
        className="custom-class"
        disabled={true}
        type="submit"
      >
        Submit
      </AnalyticsButton>
    );

    const button = getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should work with different element types', () => {
    const { getByRole } = render(
      <AnalyticsButton elementName="link-button" as="a" href="/about">
        About Link
      </AnalyticsButton>
    );

    const link = getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should track click on link elements', () => {
    const { getByRole } = render(
      <AnalyticsButton
        elementName="navigation-link"
        as="a"
        href="/blog"
        location="navigation"
      >
        Blog
      </AnalyticsButton>
    );

    const link = getByRole('link');
    fireEvent.click(link);

    expect(mockTrackClick).toHaveBeenCalledWith(
      'navigation-link',
      'navigation'
    );
  });
});
