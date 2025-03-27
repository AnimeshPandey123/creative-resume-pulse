
import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

interface Project {
  title: string;
  role: string;
  url: string;
  description: string[];
  technologies: string[];
}

const projectsData: Project[] = [
  {
    title: "AQUA Expeditions",
    role: "Senior Software Engineer",
    url: "https://www.aquaexpeditions.com/",
    description: [
      "Developed backend using PHP, ensuring seamless functionality for the booking platform.",
      "Implemented CI/CD pipelines with Docker to ensure continuous integration and testing."
    ],
    technologies: ["PHP", "MySQL", "Docker", "CI/CD"]
  },
  {
    title: "SSN",
    role: "Senior Software Engineer",
    url: "https://startupsg.gov.sg/",
    description: [
      "A platform bolstering Singapore's startup ecosystem, and enhancing tech startup collaborations in Singapore."
    ],
    technologies: ["PHP", "JavaScript", "React", "MySQL"]
  },
  {
    title: "Lugmety",
    role: "API and Backend Developer",
    url: "https://lugmety.com/",
    description: [
      "Built PHP-based microservices for order management, optimizing database interactions with MySQL.",
      "Used TDD to ensure high code quality, utilizing PHPUnit for continuous testing."
    ],
    technologies: ["PHP", "Microservices", "MySQL", "TDD", "PHPUnit"]
  },
  {
    title: "SpaceTogether",
    role: "Full Stack Developer",
    url: "https://spacetogether.com/",
    description: [
      "Developed API and backend for space rental platform using PHP and MySQL.",
      "Implemented SOLID design patterns to create extensible, maintainable code."
    ],
    technologies: ["PHP", "MySQL", "SOLID", "API Development"]
  },
  {
    title: "Keppler Hosting",
    role: "API and Backend Developer",
    url: "https://customerv2.keplerhosting.cloud",
    description: [
      "This application provides hosting features for WordPress, React, and E-commerce applications."
    ],
    technologies: ["PHP", "Docker", "WordPress", "React", "E-commerce"]
  }
];

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

    projectCardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      projectCardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="section-container">
        <h2 className="section-title">Notable Projects</h2>
        <p className="section-subtitle">
          A showcase of my work across various technologies and industries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {projectsData.map((project, index) => (
            <div
              key={index}
              ref={el => projectCardsRef.current[index] = el}
              className="project-card opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-primary">{project.role}</p>
                  </div>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Visit ${project.title} website`}
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
                
                <ul className="mb-4 space-y-2">
                  {project.description.map((point, idx) => (
                    <li key={idx} className="text-sm flex">
                      <span className="text-primary mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="skill-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
