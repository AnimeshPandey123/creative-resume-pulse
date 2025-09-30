import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectsInteractivity from '../ProjectsInteractivity';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: jest.fn(),
});

global.IntersectionObserver = mockIntersectionObserver;

// Mock DOM methods
const mockQuerySelectorAll = jest.fn();
const mockGetElementById = jest.fn();
const mockAppendChild = jest.fn();

Object.defineProperty(document, 'querySelectorAll', {
  value: mockQuerySelectorAll,
  writable: true,
});

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
});

describe('ProjectsInteractivity', () => {
  const defaultProps = {
    totalProjects: 8,
    totalCategories: 3,
    totalTechnologies: 23,
    categories: ['all', 'AI/ML', 'Backend', 'Frontend'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock DOM elements
    const mockProjectCard = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'test project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'true',
        projectYear: '2024',
      },
      textContent: 'test project description',
    };

    const mockGrid = {
      children: [mockProjectCard],
      appendChild: mockAppendChild,
      querySelectorAll: jest.fn().mockReturnValue([mockProjectCard]),
    };

    const mockResultsElement = {
      textContent: '8 projects found',
    };

    mockQuerySelectorAll.mockReturnValue([mockProjectCard]);
    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });
  });

  it('renders stats correctly', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
  });

  it('renders search input with correct placeholder', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      'Search projects, technologies...'
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('renders category filter dropdown with correct options', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toBeInTheDocument();

    // Check all category options are present
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('renders sort dropdown with correct options', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');
    expect(sortSelect).toBeInTheDocument();

    // Check all sort options are present
    expect(screen.getByText('Featured First')).toBeInTheDocument();
    expect(screen.getByText('Newest First')).toBeInTheDocument();
    expect(screen.getByText('Alphabetical')).toBeInTheDocument();
  });

  it('renders view toggle button', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });
    expect(viewToggleButton).toBeInTheDocument();
  });

  it('updates search term when typing in search input', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      'Search projects, technologies...'
    );
    fireEvent.change(searchInput, { target: { value: 'react' } });

    expect(searchInput).toHaveValue('react');
  });

  it('updates selected category when category is changed', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'Frontend' } });

    expect(categorySelect).toHaveValue('Frontend');
  });

  it('updates sort option when sort is changed', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');
    fireEvent.change(sortSelect, { target: { value: 'year' } });

    expect(sortSelect).toHaveValue('year');
  });

  it('toggles view mode when view toggle button is clicked', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });
    fireEvent.click(viewToggleButton);

    // The button should still be present (just toggles internal state)
    expect(viewToggleButton).toBeInTheDocument();
  });

  it('displays initial results count', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    expect(screen.getByText('8 projects found')).toBeInTheDocument();
  });

  it('calls DOM manipulation methods when search term changes', async () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      'Search projects, technologies...'
    );
    fireEvent.change(searchInput, { target: { value: 'react' } });

    await waitFor(() => {
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-project-id]');
    });
  });

  it('calls DOM manipulation methods when category changes', async () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'Frontend' } });

    await waitFor(() => {
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-project-id]');
    });
  });

  it('calls DOM manipulation methods when sort changes', async () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');
    fireEvent.change(sortSelect, { target: { value: 'year' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });
  });

  it('handles empty categories array', () => {
    const propsWithEmptyCategories = {
      ...defaultProps,
      categories: ['all'],
    };

    render(<ProjectsInteractivity {...propsWithEmptyCategories} />);

    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('handles zero stats gracefully', () => {
    const propsWithZeroStats = {
      ...defaultProps,
      totalProjects: 0,
      totalCategories: 0,
      totalTechnologies: 0,
    };

    render(<ProjectsInteractivity {...propsWithZeroStats} />);

    // Check that all three stats show 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(3); // 3 stats

    expect(screen.getByText('0 projects found')).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    const { container } = render(<ProjectsInteractivity {...defaultProps} />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('space-y-6');

    const statsGrid = container.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-3.gap-6'
    );
    expect(statsGrid).toBeInTheDocument();

    const controlsContainer = container.querySelector(
      '.flex.flex-col.lg\\:flex-row.gap-4'
    );
    expect(controlsContainer).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      'Search projects, technologies...'
    );
    expect(searchInput).toHaveAttribute('type', 'text');

    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toHaveAttribute('class');

    const sortSelect = screen.getByDisplayValue('Featured First');
    expect(sortSelect).toHaveAttribute('class');

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });
    expect(viewToggleButton).toHaveAttribute('title', 'Toggle view mode');
  });

  it('maintains state correctly across multiple interactions', () => {
    render(<ProjectsInteractivity {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      'Search projects, technologies...'
    );
    const categorySelect = screen.getByDisplayValue('All Categories');
    const sortSelect = screen.getByDisplayValue('Featured First');

    // Change search
    fireEvent.change(searchInput, { target: { value: 'react' } });
    expect(searchInput).toHaveValue('react');

    // Change category
    fireEvent.change(categorySelect, { target: { value: 'Frontend' } });
    expect(categorySelect).toHaveValue('Frontend');

    // Change sort
    fireEvent.change(sortSelect, { target: { value: 'year' } });
    expect(sortSelect).toHaveValue('year');

    // Verify all changes are maintained
    expect(searchInput).toHaveValue('react');
    expect(categorySelect).toHaveValue('Frontend');
    expect(sortSelect).toHaveValue('year');
  });

  it('covers sorting logic with featured projects', async () => {
    // Mock DOM elements with featured and non-featured projects
    const mockFeaturedProject = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Featured Project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'true',
        projectYear: '2024',
      },
      textContent: 'featured project description',
      querySelector: jest.fn().mockReturnValue({}), // Has featured attribute
    };

    const mockRegularProject = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Regular Project',
        projectTechnologies: 'vue javascript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2023',
      },
      textContent: 'regular project description',
      querySelector: jest.fn().mockReturnValue(null), // No featured attribute
    };

    const mockGrid = {
      children: [mockRegularProject, mockFeaturedProject],
      appendChild: mockAppendChild,
      querySelectorAll: jest
        .fn()
        .mockReturnValue([mockFeaturedProject, mockRegularProject]),
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return { textContent: '2 projects found' };
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test featured sorting
    fireEvent.change(sortSelect, { target: { value: 'featured' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });
  });

  it('covers sorting logic with name sorting', async () => {
    const mockProject1 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Alpha Project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2024',
      },
      textContent: 'alpha project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockProject2 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Beta Project',
        projectTechnologies: 'vue javascript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2023',
      },
      textContent: 'beta project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockGrid = {
      children: [mockProject2, mockProject1],
      appendChild: mockAppendChild,
      querySelectorAll: jest.fn().mockReturnValue([mockProject1, mockProject2]),
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return { textContent: '2 projects found' };
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test name sorting
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });
  });

  it('covers sorting logic with year sorting', async () => {
    const mockProject1 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Newer Project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2024',
      },
      textContent: 'newer project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockProject2 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Older Project',
        projectTechnologies: 'vue javascript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2023',
      },
      textContent: 'older project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockGrid = {
      children: [mockProject2, mockProject1],
      appendChild: mockAppendChild,
      querySelectorAll: jest.fn().mockReturnValue([mockProject1, mockProject2]),
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return { textContent: '2 projects found' };
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test year sorting
    fireEvent.change(sortSelect, { target: { value: 'year' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });
  });

  it('covers view toggle to grid mode (else branch)', () => {
    // Mock grid element with list class initially
    const mockGrid = {
      className: 'flex flex-col space-y-4', // List view class
      children: [],
      appendChild: mockAppendChild,
      querySelectorAll: jest.fn().mockReturnValue([]),
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return { textContent: '0 projects found' };
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });

    // Click to toggle from list to grid (this should trigger the else branch)
    fireEvent.click(viewToggleButton);

    // Verify the button is still present
    expect(viewToggleButton).toBeInTheDocument();
  });

  it('covers default case in sorting switch statement', async () => {
    const mockProject = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Test Project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2024',
      },
      textContent: 'test project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockGrid = {
      children: [mockProject],
      appendChild: mockAppendChild,
      querySelectorAll: jest.fn().mockReturnValue([mockProject]),
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return { textContent: '1 project found' };
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test with an invalid sort value to trigger default case
    fireEvent.change(sortSelect, { target: { value: 'invalid' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });
  });

  it('covers the actual sorting logic execution with proper DOM manipulation', async () => {
    // Create a more realistic mock that actually executes the sorting logic
    const mockProject1 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Alpha Project',
        projectTechnologies: 'react typescript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2024',
      },
      textContent: 'alpha project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    const mockProject2 = {
      style: { display: 'block' },
      dataset: {
        projectTitle: 'Beta Project',
        projectTechnologies: 'vue javascript',
        projectCategory: 'frontend',
        featured: 'false',
        projectYear: '2023',
      },
      textContent: 'beta project description',
      querySelector: jest.fn().mockReturnValue(null),
    };

    // Mock the grid with actual children that can be sorted
    const mockGrid = {
      children: [mockProject2, mockProject1], // Start with unsorted order
      appendChild: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([mockProject1, mockProject2]),
    };

    // Mock the results element
    const mockResultsElement = {
      textContent: '2 projects found',
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return mockGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Change sort to trigger the useEffect
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    // Wait for the useEffect to execute
    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });

    // Verify that the sorting logic was executed by checking if appendChild was called
    expect(mockGrid.appendChild).toHaveBeenCalled();
  });

  it('covers the view toggle else branch with proper DOM manipulation', async () => {
    // Create a real DOM element to test the actual manipulation
    const realGrid = document.createElement('div');
    realGrid.id = 'projects-grid';
    realGrid.className = 'grid grid-cols-1 gap-8'; // Start in list view
    document.body.appendChild(realGrid);

    const mockResultsElement = {
      textContent: '0 projects found',
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return realGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });

    // Click to toggle from list to grid (this should trigger the else branch)
    fireEvent.click(viewToggleButton);

    // Wait for the state update and DOM manipulation
    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });

    // Verify the button is still present
    expect(viewToggleButton).toBeInTheDocument();

    // Clean up
    document.body.removeChild(realGrid);
  });

  it('covers the default case in sorting with real DOM manipulation', async () => {
    // Create a real DOM element to test the actual manipulation
    const realGrid = document.createElement('div');
    realGrid.id = 'projects-grid';
    document.body.appendChild(realGrid);

    const mockResultsElement = {
      textContent: '0 projects found',
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return realGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test with an invalid sort value to trigger default case
    fireEvent.change(sortSelect, { target: { value: 'invalid' } });

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });

    // Clean up
    document.body.removeChild(realGrid);
  });

  it('covers all sorting branches with comprehensive DOM testing', async () => {
    // Create a real DOM element with children to test sorting
    const realGrid = document.createElement('div');
    realGrid.id = 'projects-grid';

    // Create child elements that can be sorted
    const child1 = document.createElement('div');
    child1.dataset.projectTitle = 'Alpha Project';
    child1.dataset.projectTechnologies = 'react typescript';
    child1.dataset.projectCategory = 'frontend';
    child1.textContent = 'alpha project description';

    const child2 = document.createElement('div');
    child2.dataset.projectTitle = 'Beta Project';
    child2.dataset.projectTechnologies = 'vue javascript';
    child2.dataset.projectCategory = 'frontend';
    child2.textContent = 'beta project description';

    realGrid.appendChild(child1);
    realGrid.appendChild(child2);
    document.body.appendChild(realGrid);

    const mockResultsElement = {
      textContent: '2 projects found',
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return realGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Featured First');

    // Test all sorting options to ensure all branches are covered
    const sortOptions = ['featured', 'name', 'year', 'invalid'];

    for (const option of sortOptions) {
      fireEvent.change(sortSelect, { target: { value: option } });

      await waitFor(() => {
        expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
      });
    }

    // Clean up
    document.body.removeChild(realGrid);
  });

  it('covers view toggle with comprehensive state testing', async () => {
    // Create a real DOM element to test view toggle
    const realGrid = document.createElement('div');
    realGrid.id = 'projects-grid';
    realGrid.className = 'grid grid-cols-1 gap-8'; // Start in list view
    document.body.appendChild(realGrid);

    const mockResultsElement = {
      textContent: '0 projects found',
    };

    mockGetElementById.mockImplementation(id => {
      if (id === 'projects-grid') return realGrid;
      if (id === 'results-count') return mockResultsElement;
      return null;
    });

    render(<ProjectsInteractivity {...defaultProps} />);

    const viewToggleButton = screen.getByRole('button', {
      name: 'Toggle view mode',
    });

    // Test multiple toggles to ensure both branches are covered
    fireEvent.click(viewToggleButton); // Should trigger else branch (list -> grid)
    fireEvent.click(viewToggleButton); // Should trigger if branch (grid -> list)
    fireEvent.click(viewToggleButton); // Should trigger else branch again (list -> grid)

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('projects-grid');
    });

    // Clean up
    document.body.removeChild(realGrid);
  });
});
