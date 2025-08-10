"use client";

import React, { useEffect, useRef } from 'react';
import { skillsData } from '@/data/landingData';

const Skills: React.FC = () => {
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const skillsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
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
    <section id="skills" className="py-20 bg-secondary" role="region" aria-labelledby="skills-heading">
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="skills-heading" className="section-title">
            {skillsData.title}
          </h2>
          <p className="section-subtitle">
            {skillsData.subtitle}
          </p>
        </header>

        <div
          ref={skillsContainerRef}
          className="max-w-4xl mx-auto"
        >
          {skillsData.categories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="mb-12 last:mb-0">
              <h3 className="text-xl font-bold mb-6 text-center">
                {category.title}
              </h3>

              <div className="flex flex-wrap justify-center gap-3" role="list" aria-label={`${category.title} skills`}>
                {category.skills.map((skill, skillIndex) => {
                  const globalIndex = categoryIndex * skillsData.categories[0].skills.length + skillIndex;
                  return (
                    <div
                      key={skillIndex}
                      ref={el => { skillsRefs.current[globalIndex] = el; }}
                      className="skill-pill transition-transform hover:scale-105 cursor-default"
                      role="listitem"
                      aria-label={`Skill: ${skill}`}
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
