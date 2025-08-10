"use client";

import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { projectsData } from '@/data/landingData';

const Projects: React.FC = () => {
  const projectCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-scale-up');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRefs = projectCardsRef.current;
    currentRefs.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      currentRefs.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900" role="region" aria-labelledby="projects-heading">
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="projects-heading" className="section-title">
            {projectsData.title}
          </h2>
          <p className="section-subtitle">
            {projectsData.subtitle}
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" role="list">
            {projectsData.items.map((project, index) => (
              <article
                key={index}
                ref={el => { projectCardsRef.current[index] = el; }}
                className="glass-card p-6 dark:bg-gray-800/80 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                <header className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-primary font-medium">
                      {project.role}
                    </p>
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Visit ${project.title} project`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </header>

                <section>
                  <h4 className="sr-only">Project Description</h4>
                  <div className="space-y-3 mb-4">
                    {project.description.map((desc, descIndex) => (
                      <p key={descIndex} className="text-foreground text-sm leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                </section>

                <footer>
                  <h4 className="sr-only">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used in this project">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-accent dark:bg-gray-700 rounded-full text-xs font-medium text-accent-foreground dark:text-gray-200"
                        role="listitem"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
