"use client";

import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
    children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
    useEffect(() => {
        // Preload critical resources
        const preloadCriticalResources = () => {
            // Preload fonts
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
            fontLink.as = 'style';
            document.head.appendChild(fontLink);

            // Preload critical images
            const criticalImages = [
                '/favicon.ico'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = src;
                link.as = 'image';
                document.head.appendChild(link);
            });
        };

        // Optimize images
        const optimizeImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                // Add loading="lazy" to non-critical images
                if (!img.classList.contains('critical')) {
                    img.loading = 'lazy';
                }

                // Add decoding="async" for better performance
                img.decoding = 'async';

                // Add error handling
                img.onerror = () => {
                    img.style.display = 'none';
                };
            });
        };

        // Optimize links
        const optimizeLinks = () => {
            const links = document.querySelectorAll('a[href^="http"]');
            links.forEach(link => {
                // Add rel="noopener noreferrer" for external links
                if (link.getAttribute('href')?.includes('animeshpandey.com') === false) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        };

        // Add intersection observer for better performance
        const setupIntersectionObserver = () => {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const target = entry.target as HTMLElement;
                            target.classList.add('animate-in');
                            observer.unobserve(target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '50px'
                });

                // Observe elements with data-animate attribute
                document.querySelectorAll('[data-animate]').forEach(el => {
                    observer.observe(el);
                });
            }
        };

        // Initialize optimizations
        preloadCriticalResources();
        optimizeImages();
        optimizeLinks();
        setupIntersectionObserver();

        // Cleanup function
        return () => {
            // Cleanup any observers or event listeners if needed
        };
    }, []);

    return <>{children}</>;
};

export default PerformanceOptimizer; 