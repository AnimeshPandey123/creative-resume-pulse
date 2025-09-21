'use client';

import React, { useEffect, useRef } from 'react';
import { educationData } from '@/data/landingData';

// Dependencies interface for better testability
interface IntersectionObserverDependencies {
  IntersectionObserver: typeof IntersectionObserver;
}

// Default dependencies (browser environment)
const defaultDependencies: IntersectionObserverDependencies = {
  IntersectionObserver: typeof window !== 'undefined' ? window.IntersectionObserver : undefined as any,
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
      className="py-20 bg-white dark:bg-gray-900"
      role="region"
      aria-labelledby="education-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="education-heading" className="section-title">
            {educationData.title}
          </h2>
          <p className="section-subtitle">{educationData.subtitle}</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6 mt-12" role="list">
            {educationData.items.map((education, index) => (
              <article
                key={index}
                ref={el => {
                  educationItemsRef.current[index] = el;
                }}
                className="glass-card p-6 dark:bg-gray-800/80 dark:border-gray-700/20"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                <header className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {education.degree}
                    </h3>
                    <p className="text-primary">{education.institution}</p>
                    <p className="text-muted-foreground">
                      {education.location}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <time
                      className="px-4 py-1 bg-accent dark:bg-gray-700 rounded-full text-sm font-medium text-accent-foreground dark:text-gray-200"
                      dateTime={education.period}
                    >
                      {education.period}
                    </time>
                  </div>
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
