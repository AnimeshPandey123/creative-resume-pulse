"use client";

import React, { useEffect, useRef } from 'react';
import { educationData } from '@/data/landingData';

const Education: React.FC = () => {
  const educationItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-right');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRefs = educationItemsRef.current;
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
    <section id="education" className="py-20 bg-white dark:bg-gray-900">
      <div className="section-container">
        <h2 className="section-title">{educationData.title}</h2>
        <p className="section-subtitle">
          {educationData.subtitle}
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6 mt-12">
            {educationData.items.map((education, index) => (
              <div
                key={index}
                ref={el => { educationItemsRef.current[index] = el; }}
                className="glass-card p-6 dark:bg-gray-800/80 dark:border-gray-700/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{education.degree}</h3>
                    <p className="text-primary">{education.institution}</p>
                    <p className="text-muted-foreground">{education.location}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="px-4 py-1 bg-accent dark:bg-gray-700 rounded-full text-sm font-medium text-accent-foreground dark:text-gray-200">
                      {education.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
