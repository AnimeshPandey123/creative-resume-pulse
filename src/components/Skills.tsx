'use client';

import React, { useEffect, useRef } from 'react';
import { skillsData } from '@/data/landingData';

const Skills: React.FC = () => {
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const skillsRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        skillsRefs.current.forEach((skill, index) => {
          if (skill) {
            setTimeout(() => {
              skill.classList.add('animate-fade-in');
            }, index * 40);
          }
        });
        observer.unobserve(entries[0].target);
      }
    }, options);

    const currentRef = skillsContainerRef.current;
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
      id="skills"
      className="py-20 bg-secondary"
      role="region"
      aria-labelledby="skills-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-kicker mb-4">
              Capabilities / from the core to the edge
            </p>
            <h2 id="skills-heading" className="section-title">
              {skillsData.title}
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5">
            {skillsData.subtitle}
          </p>
        </header>

        <div
          ref={skillsContainerRef}
          data-testid="skills-container"
          className="border-b border-border"
        >
          {skillsData.categories.map((category, categoryIndex) => (
            <section
              key={categoryIndex}
              ref={el => {
                skillsRefs.current[categoryIndex] = el;
              }}
              className="index-row opacity-0"
            >
              <p className="text-xs tabular-nums text-muted-foreground md:col-span-1">
                {String(categoryIndex + 1).padStart(2, '0')}
              </p>
              <h3 className="text-xl font-medium tracking-tight text-foreground md:col-span-4">
                {category.title}
              </h3>

              <div
                className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-7"
                role="list"
                aria-label={`${category.title} skills`}
              >
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="skill-pill"
                    role="listitem"
                    aria-label={`Skill: ${skill}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
