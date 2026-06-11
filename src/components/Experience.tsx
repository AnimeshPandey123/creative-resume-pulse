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
    <article className="p-6 rounded-lg bg-white/50 dark:bg-transparent border border-white/20 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-shadow duration-300">
      <header className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {experience.title}
          </h3>
          <p className="text-primary font-medium">{experience.company}</p>
          <p className="text-muted-foreground">{experience.location}</p>
        </div>
        <time
          className="px-4 py-1 bg-accent dark:bg-gray-700/50 rounded-full text-sm font-medium text-accent-foreground dark:text-gray-200 mt-2 md:mt-0"
          dateTime={experience.period}
        >
          {experience.period}
        </time>
      </header>
      <section>
        <h4 className="sr-only">Key Responsibilities and Achievements</h4>
        <ul className="list-disc list-inside space-y-2" role="list">
          {experience.responsibilities.map((responsibility, respIndex) => (
            <li key={respIndex} className="text-foreground leading-relaxed">
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
        <header className="text-center mb-12">
          <h2 id="experience-heading" className="section-title">
            {experienceData.title}
          </h2>
          <p className="section-subtitle">{experienceData.subtitle}</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ol className="mt-8 space-y-8" role="list">
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
                  className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-white/50 dark:bg-gray-900/40 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
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
                <ol className="mt-8 space-y-8" role="list">
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
