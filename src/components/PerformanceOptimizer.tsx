'use client';

import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
}) => {
  useEffect(() => {
    // Defer non-critical optimizations to avoid render blocking
    const deferOptimizations = () => {
      // Use requestIdleCallback for non-critical operations
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          optimizeImages();
          optimizeLinks();
          setupIntersectionObserver();
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          optimizeImages();
          optimizeLinks();
          setupIntersectionObserver();
        }, 100);
      }
    };

    // Preload critical resources immediately
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = ['/favicon.ico', '/opengraph-image.png'];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Optimize images with better performance
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([data-optimized])');
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;

        // Mark as optimized to avoid double processing
        imgElement.setAttribute('data-optimized', 'true');

        // Add loading="lazy" to non-critical images
        if (!imgElement.classList.contains('critical')) {
          imgElement.loading = 'lazy';
        }

        // Add decoding="async" for better performance
        imgElement.decoding = 'async';

        // Add error handling
        imgElement.onerror = () => {
          imgElement.style.display = 'none';
        };
      });
    };

    // Optimize links
    const optimizeLinks = () => {
      const links = document.querySelectorAll(
        'a[href^="http"]:not([data-optimized])'
      );
      links.forEach(link => {
        // Mark as optimized
        link.setAttribute('data-optimized', 'true');

        // Add rel="noopener noreferrer" for external links
        if (
          link.getAttribute('href')?.includes('animeshpandey.com') === false
        ) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    };

    // Add intersection observer for better performance
    const setupIntersectionObserver = () => {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                target.classList.add('animate-in');
                observer.unobserve(target);
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '50px',
          }
        );

        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
          observer.observe(el);
        });
      }
    };

    // Initialize optimizations
    preloadCriticalResources();
    deferOptimizations();

    // Cleanup function
    return () => {
      // Cleanup any observers or event listeners if needed
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;
