'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { heroData } from '@/data/landingData';

const Hero: React.FC = () => {
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRef = subtitleRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden pt-24 md:pt-28 pb-24"
      role="banner"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent opacity-70 z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
        <div className="max-w-3xl mx-auto text-center">
          <header>
            <p
              className="text-sm md:text-base text-primary font-medium tracking-widest uppercase mb-4 animate-fade-in"
              role="doc-subtitle"
            >
              {heroData.title}
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
              Hello, I&apos;m{' '}
              <span className="text-primary">{heroData.name}</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 text-balance max-w-2xl mx-auto"
              role="doc-subtitle"
            >
              {heroData.subtitle}
            </p>
          </header>

          <nav
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-in animate-delay-200"
            role="navigation"
            aria-label="Primary navigation"
          >
            <a
              href={heroData.cta.primary.href}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 hover:shadow-md text-center"
              aria-label="Get in touch with Animesh Pandey"
            >
              {heroData.cta.primary.text}
            </a>
            <a
              href={heroData.cta.secondary.href}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all hover:bg-secondary/70 hover:shadow-md text-center"
              aria-label="View Animesh Pandey's projects"
            >
              {heroData.cta.secondary.text}
            </a>
          </nav>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <a href="#about" aria-label="Scroll down to About section">
          <ArrowDown className="text-foreground/70 hover:text-primary transition-colors" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
