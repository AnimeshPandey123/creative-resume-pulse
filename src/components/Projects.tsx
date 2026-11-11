'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
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
      className="py-20 bg-background"
      role="region"
      aria-labelledby="projects-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-kicker mb-4">Work / selected systems</p>
            <h2 id="projects-heading" className="section-title">
              {projectsData.title}
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5 md:text-right">
            {projectsData.subtitle}
          </p>
        </header>

        <div>
          <ul className="mt-12 list-none">
            {projectsData.items.map((project, index) => (
              <li
                key={index}
                ref={el => {
                  projectCardsRef.current[index] = el;
                }}
                className="index-row"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-xs tabular-nums text-muted-foreground md:col-span-1">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <header className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                    {project.role}
                  </p>
                </header>

                <section className="md:col-span-5">
                  <h4 className="sr-only">Project Outcome</h4>
                  {project.outcome ? (
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed text-foreground">
                        {project.outcome.result}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.outcome.problem}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.description.map((desc, descIndex) => (
                        <p
                          key={descIndex}
                          className="text-sm leading-relaxed text-foreground"
                        >
                          {desc}
                        </p>
                      ))}
                    </div>
                  )}
                  <h4 className="sr-only">Technologies Used</h4>
                  <ul
                    className="mt-3 flex list-none flex-wrap gap-x-3 gap-y-1"
                    aria-label="Technologies used in this project"
                  >
                    {project.technologies.map((tech, techIndex) => (
                      <li
                        key={techIndex}
                        className="text-xs text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>

                <footer className="flex items-start justify-end gap-4 md:col-span-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      View Website
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Learn more about ${project.title}`}
                    className="text-foreground/70 hover:text-foreground"
                  >
                    <span className="sr-only">Learn More</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </footer>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-border pt-6">
            <Link href="/projects" className="text-link">
              See More Projects
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
