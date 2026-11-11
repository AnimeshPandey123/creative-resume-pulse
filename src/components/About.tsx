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
      className="py-20 bg-background"
      role="region"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 id="about-heading" className="section-title">
              <span className="section-kicker mb-4 block font-medium">
                About / the person behind the systems
              </span>
              A systems mind.
              <span className="block">A human approach.</span>
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5 md:justify-self-end">
            {aboutData.subtitle}
          </p>
        </header>

        <article
          ref={aboutContentRef}
          className="grid items-start gap-8 border-t border-border pt-8 md:grid-cols-12"
        >
          <div className="md:col-span-3">
            <Image
              src={SITE_CONFIG.avatarUrl}
              alt="Portrait of Animesh Pandey"
              width={160}
              height={160}
              className="h-28 w-28 object-cover"
              priority
            />
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {aboutData.title}
            </p>
          </div>

          <div className="md:col-span-9">
            {aboutData.personalLine && (
              <p className="mb-6 max-w-2xl text-lg leading-relaxed text-foreground">
                {aboutData.personalLine}
              </p>
            )}

            {aboutData.content.map((paragraph, index) => (
              <p
                key={index}
                className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default About;
