'use client';

import React, { useEffect, useRef } from 'react';
import { heroData, resumeData } from '@/data/landingData';
import { trackDownload } from '@/lib/analytics';

const proofPoints = [
  { value: '7 years', label: 'Engineering experience' },
  { value: '1 hour → 5 min', label: 'Deployment time' },
  { value: '10 sec → 500ms', label: 'API response time' },
];

const workflowCards = [
  { step: '01 / Collect', label: 'Source material', tone: 'bg-background' },
  { step: '02 / Connect', label: 'Local retrieval', tone: 'bg-[#f3f1ea]' },
  {
    step: '03 / Clarify',
    label: 'Useful answers',
    tone: 'bg-primary text-primary-foreground',
  },
];

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
      className="relative overflow-hidden pt-28 md:pt-32 pb-8"
      role="banner"
      aria-label="Hero section"
    >
      <div className="section-container relative z-10 py-0">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <header className="lg:col-span-7">
            <p className="section-kicker mb-6 animate-fade-in">
              {heroData.title}
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-display font-medium tracking-tight leading-[1.02] animate-fade-in animate-delay-100">
              Hi, I&apos;m <span>{heroData.name}</span>.
              <span className="mt-1 block">
                I make complex things feel simple.
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground"
              role="doc-subtitle"
            >
              {heroData.subtitle}
            </p>

            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground/80">
              <span>Senior Software Engineer</span>
              <span>Preston, UK</span>
            </p>

            <nav
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
              role="navigation"
              aria-label="Primary navigation"
            >
              <a
                href={heroData.cta.secondary.href}
                className="text-link"
                aria-label="View Animesh Pandey's projects"
              >
                {heroData.cta.secondary.text} ↓
              </a>
              <a
                href={heroData.cta.primary.href}
                className="text-link"
                aria-label="Get in touch with Animesh Pandey"
              >
                {heroData.cta.primary.text}
              </a>
              <a
                href={resumeData.href}
                download={resumeData.downloadName}
                onClick={() => trackDownload(resumeData.downloadName, 'pdf')}
                className="text-link"
                aria-label="Download Animesh Pandey's CV as PDF"
              >
                {resumeData.label} ↗
              </a>
            </nav>
          </header>

          <div
            className="relative hidden h-64 lg:col-span-5 lg:block"
            aria-hidden="true"
          >
            {workflowCards.map((card, index) => (
              <div
                key={card.step}
                className={`absolute w-52 rounded-md border border-border px-4 py-5 shadow-sm ${card.tone}`}
                style={{
                  top: 12 + index * 28,
                  right: index === 2 ? 8 : 36 + index * 18,
                  transform: `rotate(${index === 2 ? -2 : 4 - index * 3}deg)`,
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.16em] opacity-70">
                  {card.step}
                </p>
                <p className="mt-3 text-lg font-medium tracking-tight">
                  {card.label}
                </p>
              </div>
            ))}
            <p className="absolute bottom-0 right-2 max-w-[14rem] text-right text-xs leading-relaxed text-muted-foreground">
              A little model of a research workflow. Good systems leave room to
              think.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-8 sm:grid-cols-3">
          {proofPoints.map(point => (
            <div key={point.label}>
              <p className="text-2xl md:text-3xl font-display font-medium tracking-tight">
                {point.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {point.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-container flex justify-end py-6">
        <a
          href="#projects"
          className="text-link"
          aria-label="Scroll down to the project index"
        >
          Index ↓
        </a>
      </div>
    </section>
  );
};

export default Hero;
