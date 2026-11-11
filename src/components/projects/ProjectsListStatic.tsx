import React from 'react';
import { Github, Eye } from 'lucide-react';
// Projects data is passed as props from server component
import type { EnhancedProject } from '@/data/projectsData';

interface ProjectsListStaticProps {
  projects: EnhancedProject[];
}

const ProjectsListStatic: React.FC<ProjectsListStaticProps> = ({
  projects,
}) => {
  return (
    <div className="border-b border-border" id="projects-grid">
      {projects.map(project => (
        <article
          key={project.id}
          className="index-row"
          data-project-id={project.id}
          data-project-category={project.category}
          data-project-title={project.title.toLowerCase()}
          data-project-technologies={project.technologies
            .join(' ')
            .toLowerCase()}
        >
          <div className="md:col-span-12">
            <header className="mb-4">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.16em] text-primary">
                  {project.category}
                </span>
                {project.featured && (
                  <span
                    className="text-[11px] uppercase tracking-[0.16em] text-foreground"
                    data-featured="true"
                  >
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-xl font-medium tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="text-sm text-primary">{project.role}</p>
            </header>

            <div className="mb-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.description[0]}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-[11px] uppercase tracking-[0.16em] text-primary mb-2">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <footer className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    <Eye className="h-4 w-4" />
                    View Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    <Github className="h-4 w-4" />
                    View Code
                  </a>
                )}
                <a
                  href={`/projects/${project.slug}`}
                  aria-label={`Learn more about ${project.title}`}
                  className="text-link"
                >
                  Learn More
                </a>
              </div>
            </footer>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProjectsListStatic;
