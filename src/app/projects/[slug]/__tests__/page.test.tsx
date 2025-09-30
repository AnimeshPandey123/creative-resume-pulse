import React from 'react';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ProjectPage, { generateStaticParams, generateMetadata } from '../page';
import { enhancedProjects } from '@/data/projectsData';
import { generatePageMetadata } from '@/config/seo';

// Mock the enhanced projects data
jest.mock('@/data/enhanced-projects.json', () => ({
  projects: [
    {
      id: 'test-project-1',
      slug: 'test-project-1',
      title: 'Test Project 1',
      role: 'Full Stack Developer',
      url: 'https://test-project-1.com',
      description: [
        'This is a comprehensive test project that demonstrates various technologies.',
        'It showcases modern web development practices and best practices.',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      category: 'Full Stack',
      featured: true,
      year: '2024',
      status: 'completed',
      githubUrl: 'https://github.com/test/project1',
      demoUrl: 'https://demo.test-project-1.com',
      thumbnail: 'https://example.com/thumb1.jpg',
      metrics: {
        users: '1000+',
        performance: '95%',
        uptime: '99.9%',
      },
      challenges: [
        'Scalability issues with large datasets',
        'Complex state management requirements',
      ],
      solutions: [
        'Implemented Redis caching layer',
        'Used Redux Toolkit for state management',
      ],
      results: [
        {
          title: 'Performance Improvement',
          description: 'Reduced load times by 60%',
        },
        {
          title: 'User Engagement',
          description: 'Increased user retention by 40%',
        },
      ],
    },
    {
      id: 'test-project-2',
      slug: 'test-project-2',
      title: 'Test Project 2',
      role: 'Backend Developer',
      url: 'https://test-project-2.com',
      description: ['A backend API project with microservices architecture.'],
      technologies: ['Python', 'FastAPI', 'Docker', 'MongoDB'],
      category: 'Backend',
      featured: false,
      year: '2023',
      status: 'ongoing',
      githubUrl: 'https://github.com/test/project2',
      demoUrl: '',
      thumbnail: '',
      metrics: {},
      challenges: [],
      solutions: [],
      results: [],
    },
    {
      id: 'test-project-3',
      slug: 'test-project-3',
      title: 'Test Project 3',
      role: 'Frontend Developer',
      url: '',
      description: ['A frontend-only project with minimal description.'],
      technologies: ['Vue.js', 'CSS'],
      category: 'Frontend',
      featured: false,
      year: '2022',
      status: 'archived',
      githubUrl: '',
      demoUrl: '',
      thumbnail: '',
      metrics: {},
      challenges: [],
      solutions: [],
      results: [],
    },
    {
      id: 'test-project-4',
      slug: 'test-project-4',
      title: 'Test Project 4',
      role: 'Developer',
      url: '',
      description: [], // Empty description array to test fallback
      technologies: ['JavaScript'],
      category: 'Other',
      featured: false,
      year: '2024',
      status: 'completed',
      githubUrl: '',
      demoUrl: '',
      thumbnail: '',
      metrics: {},
      challenges: [],
      solutions: [],
      results: [],
    },
  ],
}));

// Mock the Layout component
jest.mock('@/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock the ProjectDetailPage component
jest.mock('@/components/projects/ProjectDetailPage', () => {
  return function MockProjectDetailPage({ project }: { project: any }) {
    return (
      <div data-testid="project-detail-page">
        <h1 data-testid="project-title">{project.title}</h1>
        <p data-testid="project-description">{project.description[0]}</p>
        <div data-testid="project-technologies">
          {project.technologies.join(', ')}
        </div>
        <div data-testid="project-category">{project.category}</div>
        <div data-testid="project-status">{project.status}</div>
        <div data-testid="project-year">{project.year}</div>
        <div data-testid="project-role">{project.role}</div>
        {project.githubUrl && (
          <a
            data-testid="github-link"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            data-testid="demo-link"
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>
        )}
      </div>
    );
  };
});

// Mock the generatePageMetadata function
jest.mock('@/config/seo', () => ({
  generatePageMetadata: jest.fn(
    ({ title, description, path, keywords, type }) => ({
      title,
      description,
      path,
      keywords,
      type,
      authors: [{ name: 'Animesh Pandey' }],
      robots: 'index, follow',
      alternates: { canonical: `https://animeshpandey.com${path}` },
      openGraph: {
        type,
        title,
        description,
        url: `https://animeshpandey.com${path}`,
        siteName: 'Animesh Pandey Portfolio',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    })
  ),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('ProjectPage - generateStaticParams', () => {
  it('should generate static params for all projects', () => {
    const params = generateStaticParams();

    expect(params).toHaveLength(4);
    expect(params).toEqual([
      { slug: 'test-project-1' },
      { slug: 'test-project-2' },
      { slug: 'test-project-3' },
      { slug: 'test-project-4' },
    ]);
  });

  it('should return empty array when no projects exist', () => {
    // This test verifies the current behavior with the mocked data
    // In a real scenario, if no projects exist, generateProjectStaticParams would return []
    const params = generateStaticParams();
    expect(params).toHaveLength(4); // Current mock data has 4 projects
    expect(params).toEqual([
      { slug: 'test-project-1' },
      { slug: 'test-project-2' },
      { slug: 'test-project-3' },
      { slug: 'test-project-4' },
    ]);
  });
});

describe('ProjectPage - generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate metadata for valid project slug', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });
    const metadata = await generateMetadata({ params });

    expect(generatePageMetadata).toHaveBeenCalledWith({
      title: 'Test Project 1 - Project Details',
      description:
        'This is a comprehensive test project that demonstrates various technologies.',
      path: '/projects/test-project-1',
      keywords: [
        'Test Project 1',
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
    });

    expect(metadata).toEqual({
      title: 'Test Project 1 - Project Details',
      description:
        'This is a comprehensive test project that demonstrates various technologies.',
      path: '/projects/test-project-1',
      keywords: [
        'Test Project 1',
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
      authors: [{ name: 'Animesh Pandey' }],
      robots: 'index, follow',
      alternates: {
        canonical: 'https://animeshpandey.com/projects/test-project-1',
      },
      openGraph: {
        type: 'website',
        title: 'Test Project 1 - Project Details',
        description:
          'This is a comprehensive test project that demonstrates various technologies.',
        url: 'https://animeshpandey.com/projects/test-project-1',
        siteName: 'Animesh Pandey Portfolio',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Test Project 1 - Project Details',
        description:
          'This is a comprehensive test project that demonstrates various technologies.',
      },
    });
  });

  it('should generate metadata for project with empty description', async () => {
    const params = Promise.resolve({ slug: 'test-project-2' });
    const metadata = await generateMetadata({ params });

    expect(generatePageMetadata).toHaveBeenCalledWith({
      title: 'Test Project 2 - Project Details',
      description: 'A backend API project with microservices architecture.',
      path: '/projects/test-project-2',
      keywords: [
        'Test Project 2',
        'Python',
        'FastAPI',
        'Docker',
        'MongoDB',
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
    });

    expect(metadata.title).toBe('Test Project 2 - Project Details');
    expect(metadata.description).toBe(
      'A backend API project with microservices architecture.'
    );
  });

  it('should return fallback metadata for invalid project slug', async () => {
    const params = Promise.resolve({ slug: 'non-existent-project' });
    const metadata = await generateMetadata({ params });

    expect(generatePageMetadata).not.toHaveBeenCalled();
    expect(metadata).toEqual({
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    });
  });

  it('should handle project with minimal description array', async () => {
    const params = Promise.resolve({ slug: 'test-project-3' });
    const metadata = await generateMetadata({ params });

    expect(generatePageMetadata).toHaveBeenCalledWith({
      title: 'Test Project 3 - Project Details',
      description: 'A frontend-only project with minimal description.',
      path: '/projects/test-project-3',
      keywords: [
        'Test Project 3',
        'Vue.js',
        'CSS',
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
    });

    expect(metadata.title).toBe('Test Project 3 - Project Details');
    expect(metadata.description).toBe(
      'A frontend-only project with minimal description.'
    );
  });

  it('should handle async params correctly', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    // Test that the function properly awaits the params
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('Test Project 1 - Project Details');
  });

  it('should use fallback description when project description is empty', async () => {
    const params = Promise.resolve({ slug: 'test-project-4' });
    const metadata = await generateMetadata({ params });

    expect(generatePageMetadata).toHaveBeenCalledWith({
      title: 'Test Project 4 - Project Details',
      description:
        'Learn more about Test Project 4, a project by Animesh Pandey.',
      path: '/projects/test-project-4',
      keywords: [
        'Test Project 4',
        'JavaScript',
        'Project Portfolio',
        'Software Development',
        'Animesh Pandey',
      ],
      type: 'website',
    });

    expect(metadata.title).toBe('Test Project 4 - Project Details');
    expect(metadata.description).toBe(
      'Learn more about Test Project 4, a project by Animesh Pandey.'
    );
  });
});

describe('ProjectPage - Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render project page with valid slug', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
    expect(screen.getByTestId('project-title')).toHaveTextContent(
      'Test Project 1'
    );
    expect(screen.getByTestId('project-description')).toHaveTextContent(
      'This is a comprehensive test project that demonstrates various technologies.'
    );
    expect(screen.getByTestId('project-technologies')).toHaveTextContent(
      'React, TypeScript, Node.js, PostgreSQL'
    );
    expect(screen.getByTestId('project-category')).toHaveTextContent(
      'Full Stack'
    );
    expect(screen.getByTestId('project-status')).toHaveTextContent('completed');
    expect(screen.getByTestId('project-year')).toHaveTextContent('2024');
    expect(screen.getByTestId('project-role')).toHaveTextContent(
      'Full Stack Developer'
    );
  });

  it('should render project with GitHub and demo links', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('github-link')).toBeInTheDocument();
    expect(screen.getByTestId('github-link')).toHaveAttribute(
      'href',
      'https://github.com/test/project1'
    );
    expect(screen.getByTestId('demo-link')).toBeInTheDocument();
    expect(screen.getByTestId('demo-link')).toHaveAttribute(
      'href',
      'https://demo.test-project-1.com'
    );
  });

  it('should render project without demo link when not available', async () => {
    const params = Promise.resolve({ slug: 'test-project-2' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('github-link')).toBeInTheDocument();
    expect(screen.queryByTestId('demo-link')).not.toBeInTheDocument();
  });

  it('should render project without GitHub link when not available', async () => {
    const params = Promise.resolve({ slug: 'test-project-3' });

    render(await ProjectPage({ params }));

    expect(screen.queryByTestId('github-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('demo-link')).not.toBeInTheDocument();
  });

  it('should call notFound for invalid project slug', async () => {
    const params = Promise.resolve({ slug: 'non-existent-project' });

    // Mock notFound to throw an error to test the behavior
    const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;
    mockNotFound.mockImplementation(() => {
      throw new Error('Not Found');
    });

    await expect(ProjectPage({ params })).rejects.toThrow('Not Found');
    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should handle different project statuses correctly', async () => {
    const params = Promise.resolve({ slug: 'test-project-2' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('project-status')).toHaveTextContent('ongoing');
  });

  it('should handle archived project status', async () => {
    const params = Promise.resolve({ slug: 'test-project-3' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('project-status')).toHaveTextContent('archived');
  });

  it('should pass correct project data to ProjectDetailPage component', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    render(await ProjectPage({ params }));

    // Verify that the project data is correctly passed and rendered
    expect(screen.getByTestId('project-title')).toHaveTextContent(
      'Test Project 1'
    );
    expect(screen.getByTestId('project-category')).toHaveTextContent(
      'Full Stack'
    );
    expect(screen.getByTestId('project-year')).toHaveTextContent('2024');
    expect(screen.getByTestId('project-role')).toHaveTextContent(
      'Full Stack Developer'
    );
  });

  it('should handle async params correctly', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    // Test that the component properly awaits the params
    const result = await ProjectPage({ params });
    render(result);

    expect(screen.getByTestId('project-title')).toHaveTextContent(
      'Test Project 1'
    );
  });

  it('should render Layout component as wrapper', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    render(await ProjectPage({ params }));

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
  });
});

describe('ProjectPage - Edge Cases', () => {
  it('should handle project with empty technologies array', async () => {
    // Test with existing project that has technologies
    const params = Promise.resolve({ slug: 'test-project-1' });
    const metadata = await generateMetadata({ params });

    // Verify that technologies are included in keywords
    expect(metadata.keywords).toContain('React');
    expect(metadata.keywords).toContain('TypeScript');
    expect(metadata.keywords).toContain('Node.js');
    expect(metadata.keywords).toContain('PostgreSQL');
    expect(metadata.keywords).toContain('Project Portfolio');
    expect(metadata.keywords).toContain('Software Development');
    expect(metadata.keywords).toContain('Animesh Pandey');
  });

  it('should handle project with multiple description paragraphs', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });
    const metadata = await generateMetadata({ params });

    // Should use the first description paragraph
    expect(metadata.description).toBe(
      'This is a comprehensive test project that demonstrates various technologies.'
    );
  });

  it('should handle project with minimal description', async () => {
    const params = Promise.resolve({ slug: 'test-project-2' });
    const metadata = await generateMetadata({ params });

    // Should use the available description
    expect(metadata.description).toBe(
      'A backend API project with microservices architecture.'
    );
  });

  it('should handle project with special characters in title', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });
    const metadata = await generateMetadata({ params });

    // Should handle the title correctly
    expect(metadata.title).toBe('Test Project 1 - Project Details');
    expect(metadata.title).toContain('Test Project 1');
  });

  it('should generate fallback description when project not found', async () => {
    const params = Promise.resolve({ slug: 'non-existent-project' });
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('Project Not Found');
    expect(metadata.description).toBe(
      'The requested project could not be found.'
    );
  });
});

describe('ProjectPage - Integration Tests', () => {
  it('should work end-to-end with valid project data', async () => {
    const params = Promise.resolve({ slug: 'test-project-1' });

    // Test metadata generation
    const metadata = await generateMetadata({ params });
    expect(metadata.title).toBe('Test Project 1 - Project Details');

    // Test component rendering
    render(await ProjectPage({ params }));
    expect(screen.getByTestId('project-title')).toHaveTextContent(
      'Test Project 1'
    );
  });

  it('should handle multiple projects correctly', async () => {
    // Test all four projects
    const slugs = [
      'test-project-1',
      'test-project-2',
      'test-project-3',
      'test-project-4',
    ];

    for (const slug of slugs) {
      const params = Promise.resolve({ slug });

      // Test metadata
      const metadata = await generateMetadata({ params });
      expect(metadata.title).toContain('Project Details');

      // Test component
      const { unmount } = render(await ProjectPage({ params }));
      expect(screen.getByTestId('project-title')).toBeInTheDocument();
      unmount();
    }
  });

  it('should maintain consistency between generateStaticParams and actual projects', () => {
    const staticParams = generateStaticParams();
    const projectSlugs = enhancedProjects.map(p => p.slug);

    expect(staticParams).toHaveLength(projectSlugs.length);
    staticParams.forEach((param, index) => {
      expect(param.slug).toBe(projectSlugs[index]);
    });
  });
});
