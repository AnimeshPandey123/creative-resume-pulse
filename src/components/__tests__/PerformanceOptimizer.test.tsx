import React from 'react';
import { render } from '@testing-library/react';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';

// add requestIdleCallback in a typed-safe way without global interface

describe('PerformanceOptimizer', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('preloads critical resources on mount', () => {
    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );
    const links = Array.from(
      document.head.querySelectorAll('link[rel="preload"]')
    );
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining(['/favicon.ico', '/opengraph-image.png'])
    );
  });

  it('uses requestIdleCallback when available to run optimizations', () => {
    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1; // Return a valid request ID
    };
    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );
    expect(calls.length).toBe(1);
    // execute deferred callback
    calls[0]();
    // No throw means the deferred functions executed against DOM without errors
  });
});
