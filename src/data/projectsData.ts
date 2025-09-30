import enhancedProjectsData from './enhanced-projects.json';

// Type definitions for enhanced project data
export interface ProjectMetric {
  title: string;
  description: string;
}

export interface ProjectResult {
  title: string;
  description: string;
}

export interface EnhancedProject {
  id: string;
  slug: string;
  title: string;
  role: string;
  url: string;
  description: string[];
  technologies: string[];
  category: string;
  featured: boolean;
  year: string;
  status: 'completed' | 'ongoing' | 'archived';
  githubUrl?: string;
  demoUrl?: string;
  thumbnail?: string;
  metrics?: Record<string, string>;
  challenges?: string[];
  solutions?: string[];
  results?: ProjectResult[];
}

// Export the enhanced projects data
export const enhancedProjects: EnhancedProject[] =
  enhancedProjectsData.projects as EnhancedProject[];

// Utility functions for data manipulation (when needed)
export const getProjectsByCategory = (category: string): EnhancedProject[] => {
  if (category === 'all') return enhancedProjects;
  return enhancedProjects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): EnhancedProject[] => {
  return enhancedProjects.filter(project => project.featured);
};

export const getProjectById = (id: string): EnhancedProject | undefined => {
  return enhancedProjects.find(project => project.id === id);
};

export const getProjectBySlug = (slug: string): EnhancedProject | undefined => {
  return enhancedProjects.find(project => project.slug === slug);
};

export const getAllCategories = (): string[] => {
  return ['all', ...new Set(enhancedProjects.map(project => project.category))];
};

export const getAllTechnologies = (): string[] => {
  return [
    ...new Set(enhancedProjects.flatMap(project => project.technologies)),
  ];
};

// Statistics
export const getProjectStats = () => {
  return {
    totalProjects: enhancedProjects.length,
    totalCategories: new Set(enhancedProjects.map(p => p.category)).size,
    totalTechnologies: new Set(enhancedProjects.flatMap(p => p.technologies))
      .size,
    featuredProjects: enhancedProjects.filter(p => p.featured).length,
  };
};

// Search functionality
export const searchProjects = (query: string): EnhancedProject[] => {
  const lowercaseQuery = query.toLowerCase();
  return enhancedProjects.filter(
    project =>
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.some(desc =>
        desc.toLowerCase().includes(lowercaseQuery)
      ) ||
      project.technologies.some(tech =>
        tech.toLowerCase().includes(lowercaseQuery)
      ) ||
      project.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Sort functionality
export const sortProjects = (
  projects: EnhancedProject[],
  sortBy: 'featured' | 'year' | 'name'
): EnhancedProject[] => {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      case 'year':
        return parseInt(b.year) - parseInt(a.year);
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

// Generate static params for Next.js
export const generateProjectStaticParams = () => {
  return enhancedProjects.map(project => ({
    slug: project.slug,
  }));
};
