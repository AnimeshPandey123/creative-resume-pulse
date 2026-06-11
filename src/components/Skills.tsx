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
        <header className="text-center mb-12">
          <h2 id="skills-heading" className="section-title">
            {skillsData.title}
          </h2>
          <p className="section-subtitle">{skillsData.subtitle}</p>
        </header>

        <div
          ref={skillsContainerRef}
          data-testid="skills-container"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {skillsData.categories.map((category, categoryIndex) => (
            <section
              key={categoryIndex}
              ref={el => {
                skillsRefs.current[categoryIndex] = el;
              }}
              className="glass-card p-6 dark:bg-gray-800/80 opacity-0"
            >
              <h3 className="text-lg font-bold mb-4 text-foreground">
                {category.title}
              </h3>

              <div
                className="flex flex-wrap gap-2"
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
