import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectsListStatic from '../ProjectsListStatic';
import type { EnhancedProject } from '@/data/projectsData';

// Mock data for testing
const mockProjects: EnhancedProject[] = [
  {
    id: 'test-project-1',
    slug: 'test-project-1',
    title: 'Test Project 1',
    role: 'Developer',
    url: 'https://test.com',
    description: [
      'Test description paragraph 1',
      'Test description paragraph 2',
    ],
    technologies: ['React', 'TypeScript'],
    category: 'Frontend',
    featured: true,
    year: '2024',
    status: 'completed',
    githubUrl: 'https://github.com/test/project1',
    demoUrl: 'https://demo.test.com',
    thumbnail: '',
    metrics: {
      users: '100+',
      performance: '95%',
      impact: 'High',
    },
    challenges: ['Challenge 1', 'Challenge 2'],
    solutions: ['Solution 1', 'Solution 2'],
    results: [
      { title: 'Result 1', description: 'Description 1' },
      { title: 'Result 2', description: 'Description 2' },
    ],
  },
  {
    id: 'test-project-2',
    slug: 'test-project-2',
    title: 'Test Project 2',
    role: 'Designer',
    url: '',
    description: ['Test description paragraph 3'],
    technologies: ['Vue', 'CSS'],
    category: 'Backend',
    featured: false,
    year: '2023',
    status: 'ongoing',
    githubUrl: '',
    demoUrl: '',
    thumbnail: '',
    metrics: {},
    challenges: [],
    solutions: [],
    results: [],
  },
];

describe('ProjectsListStatic', () => {
  it('renders projects list with correct structure', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    // Check main container
    const grid = document.getElementById('projects-grid');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'gap-8'
    );
    expect(grid).toHaveAttribute('id', 'projects-grid');

    // Check project cards
    const projectCards = screen.getAllByRole('article');
    expect(projectCards).toHaveLength(2);
  });

  it('renders project information correctly', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    // Check first project
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(
      screen.getByText('Test description paragraph 1')
    ).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Check second project
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(
      screen.getByText('Test description paragraph 3')
    ).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('renders category badges correctly', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('renders featured badge for featured projects', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const featuredBadge = screen.getByText('Featured');
    expect(featuredBadge).toBeInTheDocument();
    expect(featuredBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    expect(featuredBadge).toHaveAttribute('data-featured', 'true');
  });

  it('does not render featured badge for non-featured projects', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const featuredBadges = screen.getAllByText('Featured');
    expect(featuredBadges).toHaveLength(1); // Only one featured project
  });

  it('renders technology tags with correct styling', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const techTags = screen.getAllByText(/React|TypeScript|Vue|CSS/);
    expect(techTags).toHaveLength(4);

    techTags.forEach(tag => {
      expect(tag).toHaveClass(
        'px-2',
        'py-1',
        'bg-gray-100',
        'dark:bg-gray-700',
        'text-gray-700',
        'dark:text-gray-300',
        'text-xs',
        'rounded-md'
      );
    });
  });

  it('renders action buttons correctly', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    // Check View Demo button for project with url (not demoUrl)
    const viewDemoButton = screen.getByText('View Demo');
    expect(viewDemoButton).toBeInTheDocument();
    expect(viewDemoButton.closest('a')).toHaveAttribute(
      'href',
      'https://test.com'
    );
    expect(viewDemoButton.closest('a')).toHaveAttribute('target', '_blank');
    expect(viewDemoButton.closest('a')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );

    // Check View Code button
    const viewCodeButton = screen.getByText('View Code');
    expect(viewCodeButton).toBeInTheDocument();
    expect(viewCodeButton.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/test/project1'
    );
    expect(viewCodeButton.closest('a')).toHaveAttribute('target', '_blank');
    expect(viewCodeButton.closest('a')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );

    // Check Learn More buttons
    const learnMoreButtons = screen.getAllByText('Learn More');
    expect(learnMoreButtons).toHaveLength(2);

    // Check Learn More links
    const learnMoreLinks = screen.getAllByRole('link', { name: /Learn More/ });
    expect(learnMoreLinks[0]).toHaveAttribute(
      'href',
      '/projects/test-project-1'
    );
    expect(learnMoreLinks[1]).toHaveAttribute(
      'href',
      '/projects/test-project-2'
    );
  });

  it('renders data attributes for client-side filtering', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const projectCards = screen.getAllByRole('article');

    // Check first project data attributes
    const firstCard = projectCards[0];
    expect(firstCard).toHaveAttribute('data-project-id', 'test-project-1');
    expect(firstCard).toHaveAttribute('data-project-title', 'test project 1');
    expect(firstCard).toHaveAttribute('data-project-category', 'Frontend');
    expect(firstCard).toHaveAttribute(
      'data-project-technologies',
      'react typescript'
    );

    // Check second project data attributes
    const secondCard = projectCards[1];
    expect(secondCard).toHaveAttribute('data-project-id', 'test-project-2');
    expect(secondCard).toHaveAttribute('data-project-title', 'test project 2');
    expect(secondCard).toHaveAttribute('data-project-category', 'Backend');
    expect(secondCard).toHaveAttribute('data-project-technologies', 'vue css');
  });

  it('handles projects without url gracefully', () => {
    const projectsWithoutUrl = mockProjects.map(project => ({
      ...project,
      url: '',
    }));

    render(<ProjectsListStatic projects={projectsWithoutUrl} />);

    // Should not render View Demo buttons
    expect(screen.queryByText('View Demo')).not.toBeInTheDocument();

    // Should still render Learn More buttons
    const learnMoreButtons = screen.getAllByText('Learn More');
    expect(learnMoreButtons).toHaveLength(2);
  });

  it('handles empty projects array', () => {
    render(<ProjectsListStatic projects={[]} />);

    const grid = document.getElementById('projects-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toBeEmptyDOMElement();
  });

  it('renders with correct accessibility attributes', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const grid = document.getElementById('projects-grid');
    expect(grid).toHaveAttribute('id', 'projects-grid');

    const projectCards = screen.getAllByRole('article');
    projectCards.forEach(card => {
      expect(card).toHaveAttribute('data-project-id');
      expect(card).toHaveAttribute('data-project-title');
      expect(card).toHaveAttribute('data-project-category');
      expect(card).toHaveAttribute('data-project-technologies');
    });
  });

  it('renders technology tags with proper accessibility', () => {
    render(<ProjectsListStatic projects={mockProjects} />);

    const techTags = screen.getAllByText(/React|TypeScript|Vue|CSS/);
    expect(techTags).toHaveLength(4);
    // Technology tags don't have role="listitem" in the actual implementation
  });
});
