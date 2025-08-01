"use client";

import React, { useEffect, useRef } from 'react';
import { aboutData } from '@/data/landingData';

const About: React.FC = () => {
  const aboutContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRef = aboutContentRef.current;
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
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="section-container">
        <h2 className="section-title">{aboutData.title}</h2>
        <p className="section-subtitle">
          {aboutData.subtitle}
        </p>

        <div
          ref={aboutContentRef}
          className="max-w-4xl mx-auto glass-card p-8 md:p-10 dark:bg-gray-800/80"
        >
          {aboutData.content.map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed mb-6 text-foreground">
              {paragraph}
            </p>
          ))}

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Location:</span>
              <span className="text-foreground">{aboutData.contact.location}</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Email:</span>
              <a href={`mailto:${aboutData.contact.email}`} className="text-foreground hover:text-primary transition-colors">
                {aboutData.contact.email}
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Phone:</span>
              <a href={`tel:${aboutData.contact.phone}`} className="text-foreground hover:text-primary transition-colors">
                {aboutData.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
