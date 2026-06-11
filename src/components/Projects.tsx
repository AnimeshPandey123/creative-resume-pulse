'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { projectsData } from '@/data/landingData';

// Dependencies interface for better testability
interface IntersectionObserverDependencies {
  IntersectionObserver: typeof IntersectionObserver;
}

// Default dependencies (browser environment)
const defaultDependencies: IntersectionObserverDependencies = {
  IntersectionObserver:
    typeof window !== 'undefined'
      ? window.IntersectionObserver
      : (undefined as any),
};

// Extracted intersection observer logic for better testability
export const createProjectsIntersectionObserverHandler = (
  dependencies: IntersectionObserverDependencies = defaultDependencies
) => {
  const createObserver = (callback: (entries: any[]) => void) => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    return new dependencies.IntersectionObserver(callback, options);
  };

  const handleIntersection = (entries: any[], observer: any) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-scale-up');
        observer.unobserve(entry.target);
      }
    });
  };

  const observeElements = (observer: any, elements: (HTMLElement | null)[]) => {
    elements.forEach(item => {
      if (item) observer.observe(item);
    });
  };

  const unobserveElements = (
    observer: any,
    elements: (HTMLElement | null)[]
  ) => {
    elements.forEach(item => {
      if (item) observer.unobserve(item);
    });
  };

  return {
    createObserver,
    handleIntersection,
    observeElements,
    unobserveElements,
  };
};

export const Projects: React.FC<{
  dependencies?: IntersectionObserverDependencies;
}> = ({ dependencies = defaultDependencies }) => {
  const projectCardsRef = useRef<(HTMLElement | null)[]>([]);
  const observerHandler = useMemo(
    () => createProjectsIntersectionObserverHandler(dependencies),
    [dependencies]
  );

  useEffect(() => {
    const observer = observerHandler.createObserver(entries => {
      observerHandler.handleIntersection(entries, observer);
    });

    const currentRefs = projectCardsRef.current;
    observerHandler.observeElements(observer, currentRefs);

    return () => {
      observerHandler.unobserveElements(observer, currentRefs);
    };
  }, [observerHandler]);

  return (
    <section
      id="projects"
      className="py-20 bg-white dark:bg-gray-900"
      role="region"
      aria-labelledby="projects-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="projects-heading" className="section-title">
            {projectsData.title}
          </h2>
          <p className="section-subtitle">{projectsData.subtitle}</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            role="list"
          >
            {projectsData.items.map((project, index) => (
              <article
                key={index}
                ref={el => {
                  projectCardsRef.current[index] = el;
                }}
                className="glass-card p-6 dark:bg-gray-800/80 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                <header className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-primary font-medium">{project.role}</p>
                </header>

                <section>
                  <h4 className="sr-only">Project Outcome</h4>
                  {project.outcome ? (
                    <div className="space-y-2 mb-4">
                      <p className="text-foreground text-sm leading-relaxed">
                        <span className="font-semibold text-primary">
                          Problem:{' '}
                        </span>
                        {project.outcome.problem}
                      </p>
                      <p className="text-foreground text-sm leading-relaxed">
                        <span className="font-semibold text-primary">
                          Result:{' '}
                        </span>
                        {project.outcome.result}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {project.description.map((desc, descIndex) => (
                        <p
                          key={descIndex}
                          className="text-foreground text-sm leading-relaxed"
                        >
                          {desc}
                        </p>
                      ))}
                    </div>
                  )}
                </section>

                <footer>
                  <h4 className="sr-only">Technologies Used</h4>
                  <div
                    className="flex flex-wrap gap-2 mb-4"
                    role="list"
                    aria-label="Technologies used in this project"
                  >
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Website
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Learn More
                    </Link>
                  </div>
                </footer>
              </article>
            ))}
          </div>

          {/* See More Button */}
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              See More Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Default export for backward compatibility
const DefaultProjects: React.FC = () => <Projects />;
export default DefaultProjects;
