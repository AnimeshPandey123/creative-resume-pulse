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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
          <div className="section-container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                My Projects
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                A collection of my work showcasing engineering expertise, AI
                innovation, and business impact across various technologies and
                domains.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Controls */}
        <section className="py-8">
          <div className="section-container">
            <ProjectsInteractivity
              totalProjects={projectStats.totalProjects}
              totalCategories={projectStats.totalCategories}
              totalTechnologies={projectStats.totalTechnologies}
              categories={categories}
            />
          </div>
        </section>

        {/* Static Projects List */}
        <section className="py-8">
          <div className="section-container">
            <ProjectsListStatic projects={enhancedProjects} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
