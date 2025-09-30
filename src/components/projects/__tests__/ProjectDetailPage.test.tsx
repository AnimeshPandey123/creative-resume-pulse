import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '../ProjectDetailPage';
import type { EnhancedProject } from '@/data/projectsData';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Github: () => <div data-testid="github-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  User: () => <div data-testid="user-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Target: () => <div data-testid="target-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

const mockProject: EnhancedProject = {
  id: 'test-project',
  slug: 'test-project',
  title: 'Test Project',
  role: 'Senior Developer',
  url: 'https://test.com',
  description: [
    'This is a comprehensive test project that demonstrates various technologies and methodologies.',
    'The project showcases best practices in software development and includes multiple features.',
    'It has been successfully deployed and is being used by thousands of users worldwide.',
  ],
  technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
  category: 'Full Stack',
  featured: true,
  year: '2024',
  status: 'completed',
  githubUrl: 'https://github.com/test/project',
  demoUrl: 'https://demo.test.com',
  thumbnail: 'https://example.com/thumbnail.jpg',
  metrics: {
    users: '10,000+',
    performance: '99.9% uptime',
    impact: 'Increased efficiency by 40%',
  },
  challenges: [
    'Handling large-scale data processing',
    'Ensuring real-time synchronization',
    'Optimizing for mobile performance',
  ],
  solutions: [
    'Implemented distributed caching with Redis',
    'Used WebSocket connections for real-time updates',
    'Applied progressive web app techniques',
  ],
  results: [
    {
      title: 'Performance Improvement',
      description: 'Reduced load times by 60% through optimization',
    },
    {
      title: 'User Engagement',
      description: 'Increased user retention by 35%',
    },
    {
      title: 'Scalability',
      description: 'Successfully handled 10x traffic increase',
    },
  ],
};

describe('ProjectDetailPage', () => {
  it('renders project title and role correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getAllByText('Senior Developer')).toHaveLength(2); // Role appears twice in the component
  });

  it('renders back navigation link', () => {
    render(<ProjectDetailPage project={mockProject} />);

    const backLink = screen.getByText('Back to Projects');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/projects');
  });

  it('renders project description paragraphs', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(
      screen.getAllByText(
        'This is a comprehensive test project that demonstrates various technologies and methodologies.'
      )
    ).toHaveLength(2); // Appears in hero and overview
    expect(
      screen.getByText(
        'The project showcases best practices in software development and includes multiple features.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'It has been successfully deployed and is being used by thousands of users worldwide.'
      )
    ).toBeInTheDocument();
  });

  it('renders technology tags correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renders project metadata correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getAllByText('Full Stack')).toHaveLength(2); // Category appears twice
    expect(screen.getAllByText('2024')).toHaveLength(2); // Year appears twice
    expect(screen.getAllByText('completed')).toHaveLength(2); // Status appears twice
  });

  it('renders action buttons with correct links', () => {
    render(<ProjectDetailPage project={mockProject} />);

    const viewDemoButton = screen.getByText('View Live Demo');
    expect(viewDemoButton).toBeInTheDocument();
    expect(viewDemoButton.closest('a')).toHaveAttribute(
      'href',
      'https://demo.test.com'
    );
    expect(viewDemoButton.closest('a')).toHaveAttribute('target', '_blank');
    expect(viewDemoButton.closest('a')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );

    const viewCodeButton = screen.getByText('View Source Code');
    expect(viewCodeButton).toBeInTheDocument();
    expect(viewCodeButton.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/test/project'
    );
    expect(viewCodeButton.closest('a')).toHaveAttribute('target', '_blank');
    expect(viewCodeButton.closest('a')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
  });

  it('renders metrics section correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('99.9% uptime')).toBeInTheDocument();
    expect(screen.getByText('Increased efficiency by 40%')).toBeInTheDocument();
  });

  it('renders challenges section correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(
      screen.getByText('Handling large-scale data processing')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ensuring real-time synchronization')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Optimizing for mobile performance')
    ).toBeInTheDocument();
  });

  it('renders solutions section correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(
      screen.getByText('Implemented distributed caching with Redis')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Used WebSocket connections for real-time updates')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Applied progressive web app techniques')
    ).toBeInTheDocument();
  });

  it('renders results section correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByText('Results & Impact')).toBeInTheDocument();
    expect(screen.getByText('Performance Improvement')).toBeInTheDocument();
    expect(
      screen.getByText('Reduced load times by 60% through optimization')
    ).toBeInTheDocument();
    expect(screen.getByText('User Engagement')).toBeInTheDocument();
    expect(
      screen.getByText('Increased user retention by 35%')
    ).toBeInTheDocument();
    expect(screen.getByText('Scalability')).toBeInTheDocument();
    expect(
      screen.getByText('Successfully handled 10x traffic increase')
    ).toBeInTheDocument();
  });

  it('handles project without demoUrl gracefully', () => {
    const projectWithoutDemo = {
      ...mockProject,
      demoUrl: '',
    };

    render(<ProjectDetailPage project={projectWithoutDemo} />);

    expect(screen.queryByText('View Live Demo')).not.toBeInTheDocument();
    expect(screen.getByText('View Source Code')).toBeInTheDocument();
  });

  it('handles project without githubUrl gracefully', () => {
    const projectWithoutGithub = {
      ...mockProject,
      githubUrl: '',
    };

    render(<ProjectDetailPage project={projectWithoutGithub} />);

    expect(screen.getByText('View Live Demo')).toBeInTheDocument();
    expect(screen.queryByText('View Source Code')).not.toBeInTheDocument();
  });

  it('handles project without challenges gracefully', () => {
    const projectWithoutChallenges = {
      ...mockProject,
      challenges: [],
    };

    render(<ProjectDetailPage project={projectWithoutChallenges} />);

    expect(screen.getByText('Challenges')).toBeInTheDocument();
    // Should not crash or show empty lists
  });

  it('handles project without solutions gracefully', () => {
    const projectWithoutSolutions = {
      ...mockProject,
      solutions: [],
    };

    render(<ProjectDetailPage project={projectWithoutSolutions} />);

    expect(screen.getByText('Solutions')).toBeInTheDocument();
    // Should not crash or show empty lists
  });

  it('handles project without results gracefully', () => {
    const projectWithoutResults = {
      ...mockProject,
      results: [],
    };

    render(<ProjectDetailPage project={projectWithoutResults} />);

    expect(screen.getByText('Results & Impact')).toBeInTheDocument();
    // Should not crash or show empty lists
  });

  it('handles project without metrics gracefully', () => {
    const projectWithoutMetrics = {
      ...mockProject,
      metrics: {},
    };

    render(<ProjectDetailPage project={projectWithoutMetrics} />);

    // Should not crash when metrics are empty
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders with correct CSS classes and structure', () => {
    const { container } = render(<ProjectDetailPage project={mockProject} />);

    // Check main container
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      'min-h-screen',
      'bg-white',
      'dark:bg-gray-900'
    );

    // Check back navigation
    const backNav = container.querySelector(
      '.border-b.border-gray-200.dark\\:border-gray-700.pt-20'
    );
    expect(backNav).toBeInTheDocument();

    // Check hero section
    const heroSection = container.querySelector('.py-16.bg-gradient-to-br');
    expect(heroSection).toBeInTheDocument();

    // Check content sections
    const contentSections = container.querySelectorAll('.py-16');
    expect(contentSections.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    render(<ProjectDetailPage project={mockProject} />);

    // Check headings hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Test Project');

    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThan(0);

    // Check links have proper attributes
    const externalLinks = screen.getAllByRole('link');
    externalLinks.forEach(link => {
      if (link.getAttribute('target') === '_blank') {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  it('renders icons correctly', () => {
    render(<ProjectDetailPage project={mockProject} />);

    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });
});
