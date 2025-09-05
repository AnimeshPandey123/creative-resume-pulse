'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/**
 * Component that automatically tracks page views when routes change
 * This works alongside @next/third-parties/google for comprehensive tracking
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Build the full page path including search parameters
    const pagePath =
      searchParams && searchParams.toString()
        ? `${pathname || '/'}?${searchParams.toString()}`
        : pathname || '/';

    // Generate a readable page title based on the path
    const pageTitle = getPageTitle(pathname || '/');

    // Track the page view
    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

/**
 * Generate a readable page title based on the pathname
 */
function getPageTitle(pathname: string): string {
  // Remove leading slash and split by '/'
  const segments = pathname.replace(/^\//, '').split('/');

  if (segments.length === 0 || segments[0] === '') {
    return 'Home';
  }

  const firstSegment = segments[0];

  // Map common routes to readable titles
  switch (firstSegment) {
    case 'about':
      return 'About';
    case 'blog':
      if (segments.length > 1) {
        return 'Blog Post';
      }
      return 'Blog';
    case 'contact':
      return 'Contact';
    case 'projects':
      return 'Projects';
    case 'experience':
      return 'Experience';
    case 'education':
      return 'Education';
    case 'skills':
      return 'Skills';
    default:
      return 'Unknown Page';
  }
}
