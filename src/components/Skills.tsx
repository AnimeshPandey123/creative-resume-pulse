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
    <section id="skills" className="py-20 bg-secondary">
      <div className="section-container">
        <h2 className="section-title">{skillsData.title}</h2>
        <p className="section-subtitle">
          {skillsData.subtitle}
        </p>

        <div
          ref={skillsContainerRef}
          className="max-w-4xl mx-auto"
        >
          {skillsData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12 last:mb-0">
              <h3 className="text-xl font-bold mb-6 text-center">{category.title}</h3>

              <div className="flex flex-wrap justify-center gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const globalIndex = categoryIndex * skillsData.categories[0].skills.length + skillIndex;
                  return (
                    <div
                      key={skillIndex}
                      ref={el => { skillsRefs.current[globalIndex] = el; }}
                      className="skill-pill transition-transform hover:scale-105 cursor-default"
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
