'use client';

import React, { useEffect, useRef } from 'react';
import { educationData } from '@/data/landingData';

// Dependencies interface for better testability
interface IntersectionObserverDependencies {
  IntersectionObserver: typeof IntersectionObserver;
}

// Default dependencies (browser environment)
const defaultDependencies: IntersectionObserverDependencies = {
  IntersectionObserver:
    typeof window !== 'undefined'
      ? window.IntersectionObserver
      : (undefined as any),
};

// Extracted intersection observer logic for better testability
export const createIntersectionObserverHandler = (
  dependencies: IntersectionObserverDependencies = defaultDependencies
) => {
  const createObserver = (callback: (entries: any[]) => void) => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    return new dependencies.IntersectionObserver(callback, options);
  };

  const handleIntersection = (entries: any[], observer: any) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-right');
        observer.unobserve(entry.target);
      }
    });
  };

  const observeElements = (observer: any, elements: (HTMLElement | null)[]) => {
    elements.forEach(item => {
      if (item) observer.observe(item);
    });
  };

  const unobserveElements = (
    observer: any,
    elements: (HTMLElement | null)[]
  ) => {
    elements.forEach(item => {
      if (item) observer.unobserve(item);
    });
  };

  return {
    createObserver,
    handleIntersection,
    observeElements,
    unobserveElements,
  };
};

export const Education: React.FC<{
  dependencies?: IntersectionObserverDependencies;
}> = ({ dependencies = defaultDependencies }) => {
  const educationItemsRef = useRef<(HTMLElement | null)[]>([]);
  const observerHandler = createIntersectionObserverHandler(dependencies);

  useEffect(() => {
    const observer = observerHandler.createObserver(entries => {
      observerHandler.handleIntersection(entries, observer);
    });

    const currentRefs = educationItemsRef.current;
    observerHandler.observeElements(observer, currentRefs);

    return () => {
      observerHandler.unobserveElements(observer, currentRefs);
    };
  }, [dependencies]);

  return (
    <section
      id="education"
      className="py-20 bg-background"
      role="region"
      aria-labelledby="education-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-kicker mb-4">Education / formation</p>
            <h2 id="education-heading" className="section-title">
              {educationData.title}
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5">
            {educationData.subtitle}
          </p>
        </header>

        <div>
          <div
            className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-12"
            role="list"
          >
            {educationData.items.map((education, index) => (
              <article
                key={index}
                ref={el => {
                  educationItemsRef.current[index] = el;
                }}
                className="border-t border-border py-8"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                <header>
                  <h3 className="text-2xl font-medium tracking-tight text-foreground">
                    {education.degree}
                  </h3>
                  <p className="mt-2 text-primary">{education.institution}</p>
                  <p className="text-sm text-muted-foreground">
                    {education.location}
                  </p>
                  <time
                    className="mt-3 block text-xs uppercase tracking-[0.14em] text-muted-foreground"
                    dateTime={education.period}
                  >
                    {education.period}
                  </time>
                </header>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Default export for backward compatibility
const DefaultEducation: React.FC = () => <Education />;
export default DefaultEducation;
