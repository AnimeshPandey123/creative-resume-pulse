import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Layout from '@/layout/Layout';
import ProjectDetailPage from '@/components/projects/ProjectDetailPage';
import {
  enhancedProjects,
  generateProjectStaticParams,
} from '@/data/projectsData';
import { generatePageMetadata } from '@/config/seo';

// Generate static params for all projects
export function generateStaticParams() {
  return generateProjectStaticParams();
}

// Generate metadata for each project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Find project by slug
  const project = enhancedProjects.find(p => p.slug === slug);

  if (project) {
    return generatePageMetadata({
      title: `${project.title} - Project Details`,
      description:
        project.description[0] ||
        `Learn more about ${project.title}, a project by Animesh Pandey.`,
      path: `/projects/${slug}`,
      keywords: [
        project.title,
        ...project.technologies,
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
    });
  }

  return {
    title: 'Project Not Found',
    description: 'The requested project could not be found.',
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find project by slug
  const project = enhancedProjects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <Layout>
      <ProjectDetailPage project={project} />
    </Layout>
  );
}
