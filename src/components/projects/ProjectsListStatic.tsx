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
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      id="projects-grid"
    >
      {projects.map(project => (
        <article
          key={project.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          data-project-id={project.id}
          data-project-category={project.category}
          data-project-title={project.title.toLowerCase()}
          data-project-technologies={project.technologies
            .join(' ')
            .toLowerCase()}
        >
          <div className="p-6">
            <header className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {project.category}
                </span>
                {project.featured && (
                  <span
                    className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                    data-featured="true"
                  >
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-primary font-medium text-sm">{project.role}</p>
            </header>

            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {project.description[0]}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <footer className="flex flex-col gap-3">
              <div className="flex gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    View Code
                  </a>
                )}
                <a
                  href={`/projects/${project.slug}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-primary text-sm font-medium rounded-lg hover:bg-primary/10 transition-colors"
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
