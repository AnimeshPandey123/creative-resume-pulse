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

        // Ensure proper alt attributes for SEO
        if (!imgElement.alt || imgElement.alt.trim() === '') {
          // Generate meaningful alt text from image src or context
          const src = imgElement.src;
          const filename = src.split('/').pop()?.split('.')[0] || 'image';
          imgElement.alt = filename
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        }

        // Add error handling with fallback
        imgElement.onerror = () => {
          imgElement.style.display = 'none';
          console.warn('Failed to load image:', imgElement.src);
        };

        // Add loading success handler
        imgElement.onload = () => {
          imgElement.style.opacity = '1';
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
