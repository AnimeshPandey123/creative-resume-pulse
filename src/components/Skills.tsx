'use client';

import React from 'react';
import { skillsData } from '@/data/landingData';

const Skills: React.FC = () => {
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

        <div data-testid="skills-container" className="border-b border-border">
          {skillsData.categories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="index-row">
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
