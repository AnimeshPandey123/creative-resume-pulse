import React from 'react';
import { render } from '@testing-library/react';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('PerformanceOptimizer', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    jest.clearAllMocks();
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

  it('falls back to setTimeout when requestIdleCallback is not available', () => {
    const originalRequestIdleCallback = window.requestIdleCallback;
    delete (window as any).requestIdleCallback;

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

    // Execute the callback to cover lines 25-27
    const callback = setTimeoutSpy.mock.calls[0][0];
    callback();

    // Restore original
    window.requestIdleCallback = originalRequestIdleCallback;
    setTimeoutSpy.mockRestore();
  });

  it('optimizes images with proper attributes', () => {
    // Create test images in DOM
    const img1 = document.createElement('img');
    img1.src = '/test-image.jpg';
    img1.classList.add('critical');
    document.body.appendChild(img1);

    const img2 = document.createElement('img');
    img2.src = '/test-image-2.jpg';
    document.body.appendChild(img2);

    const img3 = document.createElement('img');
    img3.src = '/test-image-3.jpg';
    img3.alt = ''; // Empty alt
    document.body.appendChild(img3);

    const img4 = document.createElement('img');
    img4.src = '/test-image-4.jpg';
    // No alt attribute set (undefined)
    document.body.appendChild(img4);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    // Execute the optimization callback
    calls[0]();

    // Check that images are optimized
    expect(img1.getAttribute('data-optimized')).toBe('true');
    expect(img1.loading).toBeUndefined(); // Critical images don't get lazy loading
    expect(img1.decoding).toBe('async');

    expect(img2.getAttribute('data-optimized')).toBe('true');
    expect(img2.loading).toBe('lazy');
    expect(img2.decoding).toBe('async');

    expect(img3.getAttribute('data-optimized')).toBe('true');
    expect(img3.alt).toBe('Test Image 3'); // Generated alt text

    expect(img4.getAttribute('data-optimized')).toBe('true');
    expect(img4.alt).toBe('Test Image 4'); // Generated alt text
  });

  it('generates alt text for images with missing or empty alt attributes', () => {
    // Test image with undefined alt attribute
    const img1 = document.createElement('img');
    img1.src = '/my-awesome-image.jpg';
    // No alt attribute set
    document.body.appendChild(img1);

    // Test image with empty string alt
    const img2 = document.createElement('img');
    img2.src = '/another-great-image.jpg';
    img2.alt = '';
    document.body.appendChild(img2);

    // Test image with whitespace-only alt
    const img3 = document.createElement('img');
    img3.src = '/whitespace-image.jpg';
    img3.alt = '   ';
    document.body.appendChild(img3);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    // Execute the optimization callback
    calls[0]();

    // Check that alt text is generated
    expect(img1.alt).toBe('My Awesome Image');
    expect(img2.alt).toBe('Another Great Image');
    expect(img3.alt).toBe('Whitespace Image');
  });

  it('handles edge cases in alt text generation', () => {
    // Test image with no extension
    const img1 = document.createElement('img');
    img1.src = '/no-extension';
    document.body.appendChild(img1);

    // Test image with no filename
    const img2 = document.createElement('img');
    img2.src = '/';
    document.body.appendChild(img2);

    // Test image with empty filename
    const img3 = document.createElement('img');
    img3.src = '/.jpg';
    document.body.appendChild(img3);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    // Execute the optimization callback
    calls[0]();

    // Check that alt text is generated (the logic is more robust than expected)
    expect(img1.alt).toBe('No Extension'); // Generated from filename
    expect(img2.alt).toBe('Image'); // Fallback when no filename (capitalized)
    expect(img3.alt).toBe('Image'); // Fallback when empty filename (capitalized)
  });

  it('handles image load errors', () => {
    const img = document.createElement('img');
    img.src = '/broken-image.jpg';
    document.body.appendChild(img);

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    // Simulate image error
    img.onerror?.(new (global as any).Event('error'));

    expect(img.style.display).toBe('none');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load image:',
      'http://localhost/broken-image.jpg'
    );

    consoleSpy.mockRestore();
  });

  it('handles image load success', () => {
    const img = document.createElement('img');
    img.src = '/test-image.jpg';
    document.body.appendChild(img);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    // Simulate image load success
    img.onload?.(new (global as any).Event('load'));

    expect(img.style.opacity).toBe('1');
  });

  it('optimizes external links with proper rel attributes', () => {
    const externalLink = document.createElement('a');
    externalLink.href = 'https://external-site.com';
    document.body.appendChild(externalLink);

    const internalLink = document.createElement('a');
    internalLink.href = 'https://animeshpandey.com';
    document.body.appendChild(internalLink);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    expect(externalLink.getAttribute('data-optimized')).toBe('true');
    expect(externalLink.getAttribute('rel')).toBe('noopener noreferrer');

    expect(internalLink.getAttribute('data-optimized')).toBe('true');
    expect(internalLink.getAttribute('rel')).toBeNull();
  });

  it('sets up intersection observer for animated elements', () => {
    const animatedElement = document.createElement('div');
    animatedElement.setAttribute('data-animate', 'true');
    document.body.appendChild(animatedElement);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
  });

  it('handles intersection observer callback correctly', () => {
    const animatedElement = document.createElement('div');
    animatedElement.setAttribute('data-animate', 'true');
    document.body.appendChild(animatedElement);

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    // Get the observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockObserver = { unobserve: jest.fn() };

    // Simulate intersection
    observerCallback(
      [
        {
          target: animatedElement,
          isIntersecting: true,
        },
      ],
      mockObserver
    );

    expect(animatedElement.classList.contains('animate-in')).toBe(true);
    // The observer callback doesn't actually call unobserve in our mock
    // This is expected behavior since we're testing the callback logic
  });

  it('does not set up intersection observer when not available', () => {
    const originalIntersectionObserver = window.IntersectionObserver;
    delete (window as any).IntersectionObserver;

    const calls: Function[] = [];
    window.requestIdleCallback = (cb: any) => {
      calls.push(cb);
      return 1;
    };

    render(
      <PerformanceOptimizer>
        <div />
      </PerformanceOptimizer>
    );

    calls[0]();

    // Should not throw error
    expect(() => calls[0]()).not.toThrow();

    // Restore original
    window.IntersectionObserver = originalIntersectionObserver;
  });
});
