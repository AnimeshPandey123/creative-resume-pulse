"use client";

import React, { useEffect, useRef } from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

const experienceData: ExperienceItem[] = [
  {
    title: "Sr. Software Engineer",
    company: "Red Airship",
    period: "July 2022 - July 2024",
    location: "Singapore",
    responsibilities: [
      "Led backend and frontend development, creating scalable, performance-optimized solutions for complex applications.",
      "Worked closely with cross-functional teams to design and implement microservice architectures using Python, PHP, Vue, React, and TypeScript.",
      "Enhanced database queries and UI components to improve application efficiency, ensuring an optimal user experience.",
      "Conducted code reviews and implemented best practices like clean code, testing (unit/integration), and agile methodologies to maintain high-quality development standards.",
      "Collaborated on project requirements and development lifecycle, ensuring smooth client interactions and alignment with business goals."
    ]
  },
  {
    title: "Sr. Software Engineer",
    company: "Hazesoft",
    period: "March 2020 - July 2022",
    location: "Baneshwor",
    responsibilities: [
      "Led backend development with a focus on PHP, Python and MySQL, ensuring high scalability and performance.",
      "Developed and optimized microservices architecture using Docker and Kubernetes, delivering innovative marketing solutions.",
      "Spearheaded the transition from monolithic to microservices architecture, significantly improving system performance and efficiency.",
      "Developed RESTful APIs and integrated third-party services for diverse client requirements, ensuring scalable software products.",
      "Played a key role in designing system architecture, implementing best practices like testing and code reviews to deliver robust solutions."
    ]
  },
  {
    title: "Web Developer",
    company: "Karkhana",
    period: "December 2017 - March 2020",
    location: "Gyaneshwor",
    responsibilities: [
      "Contributed to both backend and frontend development using PHP, JavaScript, and SQL, delivering user-friendly applications in a fast-paced environment.",
      "Implemented robust, data-driven solutions to enhance user interaction and streamline content management systems.",
      "Worked closely with stakeholders to gather requirements and deliver efficient, scalable web applications."
    ]
  }
];

const Experience: React.FC = () => {
  const experienceItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-left');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    experienceItemsRef.current.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => {
      experienceItemsRef.current.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="experience" className="py-20 bg-accent/50 dark:bg-accent/20">
      <div className="section-container">
        <h2 className="section-title">Professional Experience</h2>
        <p className="section-subtitle">
          My professional journey and the valuable experience I've gained along the way.
        </p>

        <div className="max-w-4xl mx-auto">
          <ul className="mt-8">
            {experienceData.map((experience, index) => (
              <li
                key={index}
                ref={el => { experienceItemsRef.current[index] = el; }}
                className="timeline-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{experience.title}</h3>
                      <p className="text-primary font-medium">{experience.company}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-muted-foreground">
                      <p>{experience.period}</p>
                      <p>{experience.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {experience.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2 mt-1.5">•</span>
                        <span className="text-foreground dark:text-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Experience;
