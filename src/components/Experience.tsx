'use client';

import React, { useEffect, useRef } from 'react';
import { experienceData } from '@/data/landingData';

const Experience: React.FC = () => {
  const experienceItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-left');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRefs = experienceItemsRef.current;
    currentRefs.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => {
      currentRefs.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section
      id="experience"
      className="py-20 bg-accent/50 dark:bg-accent/20"
      role="region"
      aria-labelledby="experience-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="experience-heading" className="section-title">
            {experienceData.title}
          </h2>
          <p className="section-subtitle">{experienceData.subtitle}</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ol className="mt-8 space-y-8" role="list">
            {experienceData.items.map((experience, index) => (
              <li
                key={index}
                ref={el => {
                  experienceItemsRef.current[index] = el;
                }}
                className="timeline-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <article className="p-6 rounded-lg bg-white/50 dark:bg-transparent border border-white/20 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <header className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {experience.title}
                      </h3>
                      <p className="text-primary font-medium">
                        {experience.company}
                      </p>
                      <p className="text-muted-foreground">
                        {experience.location}
                      </p>
                    </div>
                    <time
                      className="px-4 py-1 bg-accent dark:bg-gray-700/50 rounded-full text-sm font-medium text-accent-foreground dark:text-gray-200 mt-2 md:mt-0"
                      dateTime={experience.period}
                    >
                      {experience.period}
                    </time>
                  </header>
                  <section>
                    <h4 className="sr-only">
                      Key Responsibilities and Achievements
                    </h4>
                    <ul className="list-disc list-inside space-y-2" role="list">
                      {experience.responsibilities.map(
                        (responsibility, respIndex) => (
                          <li
                            key={respIndex}
                            className="text-foreground leading-relaxed"
                          >
                            {responsibility}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
