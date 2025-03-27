
import React, { useEffect, useRef } from 'react';

interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

const educationData: EducationItem[] = [
  {
    degree: "Master's degree in Computer Science",
    institution: "University of Wolverhampton",
    location: "Wolverhampton, UK",
    period: "2025 - present"
  },
  {
    degree: "Bachelor's degree in Computer Science and Information Technology",
    institution: "St. Xavier's College",
    location: "Maitighar, Kathmandu",
    period: "2015 - 2019"
  },
  {
    degree: "High School with Physics as a Major",
    institution: "St. Xavier's College",
    location: "Maitighar, Kathmandu",
    period: "2012 - 2015"
  }
];

const Education: React.FC = () => {
  const educationItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-right');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    educationItemsRef.current.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => {
      educationItemsRef.current.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="education" className="py-20 bg-white">
      <div className="section-container">
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">
          My academic background and qualifications.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6 mt-12">
            {educationData.map((education, index) => (
              <div
                key={index}
                ref={el => educationItemsRef.current[index] = el}
                className="glass-card p-6 opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{education.degree}</h3>
                    <p className="text-primary">{education.institution}</p>
                    <p className="text-muted-foreground">{education.location}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="px-4 py-1 bg-accent rounded-full text-sm font-medium">
                      {education.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
