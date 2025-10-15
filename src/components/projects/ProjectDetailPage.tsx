import React from 'react';
import { ArrowLeft, Github, Calendar, User, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import type { EnhancedProject } from '@/data/projectsData';

interface ProjectDetailPageProps {
  project: EnhancedProject;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  // Use the enhanced project data directly
  const enhancedProject = project;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 pt-20">
        <div className="section-container py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Project Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                {enhancedProject.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {project.description[0]}
            </p>

            {/* Project Meta */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{project.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{enhancedProject.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{enhancedProject.status}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {enhancedProject.demoUrl && (
                <a
                  href={enhancedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  View Live Demo
                </a>
              )}
              {enhancedProject.githubUrl && (
                <a
                  href={enhancedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  View Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Project Overview */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Project Overview
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {project.description.map((desc, index) => (
                      <p
                        key={index}
                        className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
                      >
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Challenges & Solutions */}
                {enhancedProject.challenges && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Challenges & Solutions
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          Challenges
                        </h3>
                        <ul className="space-y-2">
                          {enhancedProject.challenges?.map(
                            (challenge, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {challenge}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          Solutions
                        </h3>
                        <ul className="space-y-2">
                          {enhancedProject.solutions?.map((solution, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                              <span className="text-gray-600 dark:text-gray-300">
                                {solution}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Results */}
                {enhancedProject.results && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Results & Impact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {enhancedProject.results.map((result, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {result.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {result.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-accent dark:bg-gray-700 text-accent-foreground dark:text-gray-200 text-sm font-medium rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Metrics */}
                {enhancedProject.metrics && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Key Metrics
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(enhancedProject.metrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center "
                          >
                            <span className="text-gray-600 dark:text-gray-400 capitalize px-4">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Category
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {enhancedProject.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Year
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {enhancedProject.year}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {enhancedProject.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Role
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {project.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
