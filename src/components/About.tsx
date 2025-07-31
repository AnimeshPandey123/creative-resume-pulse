"use client";

import React, { useEffect, useRef } from 'react';

const About: React.FC = () => {
  const aboutContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (aboutContentRef.current) {
      observer.observe(aboutContentRef.current);
    }

    return () => {
      if (aboutContentRef.current) {
        observer.unobserve(aboutContentRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          A passionate software engineer with a dedication to creating efficient, scalable solutions.
        </p>

        <div
          ref={aboutContentRef}
          className="max-w-4xl mx-auto glass-card p-8 md:p-10 dark:bg-gray-800/80"
        >
          <p className="text-lg leading-relaxed mb-6 text-foreground">
            As a Senior Software Engineer with 6 years of experience, I specialize in PHP and backend development,
            focusing on building scalable, high-performance applications. I have a solid background in designing
            testable, extensible systems, optimizing APIs, and applying SOLID principles and TDD methodologies.
          </p>

          <p className="text-lg leading-relaxed mb-6 text-foreground">
            With expertise in MySQL, PostgreSQL, and Docker, I excel in creating robust CI/CD pipelines and
            maintaining high development standards through code reviews and best practices.
          </p>

          <p className="text-lg leading-relaxed text-foreground">
            I am passionate about mentoring junior developers, solving complex technical challenges, and
            continuously learning new technologies such as DevOps tools and CMS platforms. My goal is to
            deliver solutions that not only meet technical requirements but also drive business success.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Location:</span>
              <span className="text-foreground">West Bromwich, Birmingham</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Email:</span>
              <a href="mailto:animeshpandey.pro@gmail.com" className="text-foreground hover:text-primary transition-colors">
                animeshpandey.pro@gmail.com
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-primary font-medium mr-3">Phone:</span>
              <a href="tel:+447775658685" className="text-foreground hover:text-primary transition-colors">
                +44 7775 658685
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
