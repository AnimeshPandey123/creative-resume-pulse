'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { aboutData } from '@/data/landingData';
import { SITE_CONFIG } from '@/config/seo';

const About: React.FC = () => {
  const aboutContentRef = useRef<HTMLDivElement>(null);

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
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-900"
      role="region"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="about-heading" className="section-title">
            {aboutData.title}
          </h2>
          <p className="section-subtitle">{aboutData.subtitle}</p>
        </header>

        <article
          ref={aboutContentRef}
          className="max-w-4xl mx-auto glass-card p-8 md:p-10 dark:bg-gray-800/80"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={SITE_CONFIG.avatarUrl}
                alt="Portrait of Animesh Pandey"
                width={160}
                height={160}
                className="h-40 w-40 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
                priority
              />
            </div>

            <div className="flex-1">
              {aboutData.personalLine && (
                <p className="text-lg font-medium text-foreground mb-6 border-l-4 border-primary pl-4 italic">
                  {aboutData.personalLine}
                </p>
              )}

              {aboutData.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed mb-6 last:mb-0 text-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default About;
