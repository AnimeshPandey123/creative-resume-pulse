import React from 'react';
import {
  ArrowLeft,
  Github,
  Calendar,
  User,
  Tag,
  Eye,
  Award,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import type { EnhancedProject } from '@/data/projectsData';

interface ProjectDetailPageProps {
  project: EnhancedProject;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  // Use the enhanced project data directly
  const enhancedProject = project;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border pt-20">
        <div className="section-container py-4">
          <Link href="/projects" className="text-link">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      <section className="py-14 md:py-16 page-hero-gradient">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="section-kicker mb-4">{enhancedProject.category}</p>

            <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-foreground mb-4">
              {project.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {project.description[0]}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
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

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7">
              {enhancedProject.demoUrl && (
                <a
                  href={enhancedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  <Eye className="h-4 w-4" />
                  View Live Demo
                </a>
              )}
              {enhancedProject.githubUrl && (
                <a
                  href={enhancedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  <Github className="h-4 w-4" />
                  View Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-12 md:py-16">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-4">
                    Project Overview
                  </h2>
                  <div className="max-w-none">
                    {project.description.map((desc, index) => (
                      <p
                        key={index}
                        className="text-muted-foreground leading-relaxed mb-4"
                      >
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>

                {enhancedProject.challenges && (
                  <div className="border-t border-border pt-8">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-6">
                      Challenges & Solutions
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.16em] text-primary mb-3 inline-flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Challenges
                        </h3>
                        <ul className="space-y-2">
                          {enhancedProject.challenges?.map(
                            (challenge, index) => (
                              <li
                                key={index}
                                className="text-muted-foreground leading-relaxed"
                              >
                                {challenge}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.16em] text-primary mb-3 inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Solutions
                        </h3>
                        <ul className="space-y-2">
                          {enhancedProject.solutions?.map((solution, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {enhancedProject.results && (
                  <div className="border-t border-border pt-8">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-6 inline-flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Results & Impact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {enhancedProject.results.map((result, index) => (
                        <div
                          key={index}
                          className="border-t border-border py-5 pr-6"
                        >
                          <h4 className="font-medium text-foreground mb-2">
                            {result.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {result.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8 lg:sticky lg:top-24 h-max">
                <div className="border-t border-border pt-6">
                  <h3 className="text-sm uppercase tracking-[0.16em] text-primary mb-4">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-sm text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {enhancedProject.metrics && (
                  <div className="border-t border-border pt-6">
                    <h3 className="text-sm uppercase tracking-[0.16em] text-primary mb-4">
                      Key Metrics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(enhancedProject.metrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-start gap-4 border-t border-border pt-3"
                          >
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-medium text-foreground">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-6">
                  <h3 className="text-sm uppercase tracking-[0.16em] text-primary mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between gap-4 border-t border-border pt-3">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">
                        {enhancedProject.category}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-border pt-3">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium text-foreground">
                        {enhancedProject.year}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-border pt-3">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-foreground capitalize">
                        {enhancedProject.status}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-border pt-3">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium text-foreground">
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
