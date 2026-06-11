import { Metadata } from 'next';
import Layout from '@/layout/Layout';
import ProjectsListStatic from '@/components/projects/ProjectsListStatic';
import ProjectsInteractivity from '@/components/projects/ProjectsInteractivity';
import { pageMetadata } from '@/config/seo';
import enhancedProjectsData from '@/data/enhanced-projects.json';

export const metadata: Metadata = pageMetadata.projects;

export default function Projects() {
  // Get data at build time (server-side)
  const enhancedProjects = enhancedProjectsData.projects as any[];

  // Calculate stats
  const projectStats = {
    totalProjects: enhancedProjects.length,
    totalCategories: new Set(enhancedProjects.map(p => p.category)).size,
    totalTechnologies: new Set(enhancedProjects.flatMap(p => p.technologies))
      .size,
  };

  // Get categories
  const categories = [
    'all',
    ...Array.from(new Set(enhancedProjects.map(p => p.category))).sort(),
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 page-hero-gradient">
          <div className="section-container pb-1">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
                My Projects
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A collection of my work showcasing engineering expertise, AI
                innovation, and business impact across various technologies and
                domains.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Controls */}
        <section className="pt-8 pb-4">
          <div className="section-container pt-1 pb-1">
            <ProjectsInteractivity
              totalProjects={projectStats.totalProjects}
              totalCategories={projectStats.totalCategories}
              totalTechnologies={projectStats.totalTechnologies}
              categories={categories}
            />
          </div>
        </section>

        {/* Static Projects List */}
        <section className="pt-4 pb-8">
          <div className="section-container ">
            <ProjectsListStatic projects={enhancedProjects} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
