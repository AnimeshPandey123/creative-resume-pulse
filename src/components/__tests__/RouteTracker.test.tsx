import React from 'react';
import { render } from '@testing-library/react';
import { usePathname, useSearchParams } from 'next/navigation';
import RouteTracker from '../RouteTracker';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockTrackEvent = require('@/lib/analytics')
  .trackEvent as jest.MockedFunction<any>;

describe('RouteTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track page view on initial render', () => {
    mockUsePathname.mockReturnValue('/about');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/about',
      page_title: 'About',
    });
  });

  it('should track page view with search parameters', () => {
    mockUsePathname.mockReturnValue('/blog');
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('?category=tech&page=2') as any
    );

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/blog?category=tech&page=2',
      page_title: 'Blog',
    });
  });

  it('should handle home page correctly', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/',
      page_title: 'Home',
    });
  });

  it('should handle blog post pages', () => {
    mockUsePathname.mockReturnValue('/blog/my-awesome-post');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/blog/my-awesome-post',
      page_title: 'Blog Post',
    });
  });

  it('should handle contact page', () => {
    mockUsePathname.mockReturnValue('/contact');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/contact',
      page_title: 'Contact',
    });
  });

  it('should handle projects page', () => {
    mockUsePathname.mockReturnValue('/projects');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/projects',
      page_title: 'Projects',
    });
  });

  it('should handle experience page', () => {
    mockUsePathname.mockReturnValue('/experience');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/experience',
      page_title: 'Experience',
    });
  });

  it('should handle education page', () => {
    mockUsePathname.mockReturnValue('/education');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/education',
      page_title: 'Education',
    });
  });

  it('should handle skills page', () => {
    mockUsePathname.mockReturnValue('/skills');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/skills',
      page_title: 'Skills',
    });
  });

  it('should handle unknown pages', () => {
    mockUsePathname.mockReturnValue('/unknown-page');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    render(<RouteTracker />);

    expect(mockTrackEvent).toHaveBeenCalledWith('page_view', {
      page_path: '/unknown-page',
      page_title: 'Unknown Page',
    });
  });

  it('should not render any visible content', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);

    const { container } = render(<RouteTracker />);

    expect(container.firstChild).toBeNull();
  });
});
