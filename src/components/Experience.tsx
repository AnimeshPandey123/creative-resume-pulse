'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experienceData } from '@/data/landingData';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const FEATURED_COMPANY_MATCHERS = ['ASquared', 'Red Airship'];

export const isFeaturedExperience = (company: string): boolean =>
  FEATURED_COMPANY_MATCHERS.some(name => company.includes(name));

interface IntersectionObserverDependencies {
  IntersectionObserver: typeof IntersectionObserver;
}

const defaultDependencies: IntersectionObserverDependencies = {
  IntersectionObserver:
    typeof window !== 'undefined'
      ? window.IntersectionObserver
      : (undefined as unknown as typeof IntersectionObserver),
};

export const createExperienceIntersectionObserverHandler = (
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
        entry.target.classList.add('animate-fade-in-left');
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

interface ExperienceItemData {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

interface ExperienceTimelineItemProps {
  experience: ExperienceItemData;
  index: number;
  itemRef: (el: HTMLLIElement | null) => void;
}

const ExperienceTimelineItem: React.FC<ExperienceTimelineItemProps> = ({
  experience,
  index,
  itemRef,
}) => (
  <li
    ref={itemRef}
    className="timeline-item"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <article>
      <header className="mb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            {experience.company}
          </h3>
          <time
            className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
            dateTime={experience.period}
          >
            {experience.period}
          </time>
        </div>
        <p className="mt-1 text-sm text-primary">{experience.title}</p>
        <p className="text-sm text-muted-foreground">{experience.location}</p>
      </header>
      <section>
        <h4 className="sr-only">Key Responsibilities and Achievements</h4>
        <ul className="space-y-2" role="list">
          {experience.responsibilities.map((responsibility, respIndex) => (
            <li
              key={respIndex}
              className="text-sm leading-relaxed text-foreground/90"
            >
              {responsibility}
            </li>
          ))}
        </ul>
      </section>
    </article>
  </li>
);

export const Experience: React.FC<{
  dependencies?: IntersectionObserverDependencies;
}> = ({ dependencies = defaultDependencies }) => {
  const [earlierOpen, setEarlierOpen] = useState(false);
  const experienceItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const observerHandler =
    createExperienceIntersectionObserverHandler(dependencies);

  const featuredItems = experienceData.items.filter(item =>
    isFeaturedExperience(item.company)
  );
  const earlierItems = experienceData.items.filter(
    item => !isFeaturedExperience(item.company)
  );

  useEffect(() => {
    const observer = observerHandler.createObserver(entries => {
      observerHandler.handleIntersection(entries, observer);
    });

    const currentRefs = experienceItemsRef.current;
    observerHandler.observeElements(observer, currentRefs);

    return () => {
      observerHandler.unobserveElements(observer, currentRefs);
    };
  }, [dependencies, earlierOpen]);

  const setItemRef = (index: number) => (el: HTMLLIElement | null) => {
    experienceItemsRef.current[index] = el;
  };

  let itemIndex = 0;

  return (
    <section
      id="experience"
      className="py-20 bg-accent/50 dark:bg-accent/20"
      role="region"
      aria-labelledby="experience-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-kicker mb-4">
              Experience / built with great teams
            </p>
            <h2 id="experience-heading" className="section-title">
              {experienceData.title}
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5">
            {experienceData.subtitle}
          </p>
        </header>

        <div>
          <ol
            className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-12"
            role="list"
          >
            {featuredItems.map(experience => {
              const currentIndex = itemIndex;
              itemIndex += 1;

              return (
                <ExperienceTimelineItem
                  key={`${experience.company}-${experience.period}`}
                  experience={experience}
                  index={currentIndex}
                  itemRef={setItemRef(currentIndex)}
                />
              );
            })}
          </ol>

          {earlierItems.length > 0 && (
            <Collapsible open={earlierOpen} onOpenChange={setEarlierOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="mt-8 w-full flex items-center justify-between gap-2 border-t border-border py-4 text-sm text-foreground hover:text-primary transition-colors"
                  aria-expanded={earlierOpen}
                >
                  {experienceData.earlierRolesLabel} ({earlierItems.length})
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      earlierOpen && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="mt-2" role="list">
                  {earlierItems.map(experience => {
                    const currentIndex = itemIndex;
                    itemIndex += 1;

                    return (
                      <ExperienceTimelineItem
                        key={`${experience.company}-${experience.period}`}
                        experience={experience}
                        index={currentIndex}
                        itemRef={setItemRef(currentIndex)}
                      />
                    );
                  })}
                </ol>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </section>
  );
};

const DefaultExperience: React.FC = () => <Experience />;
export default DefaultExperience;
