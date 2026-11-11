'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
// Data is passed as props from server component

interface ProjectsInteractivityProps {
  totalProjects: number;
  totalCategories: number;
  totalTechnologies: number;
  categories: string[];
}

const ProjectsInteractivity: React.FC<ProjectsInteractivityProps> = ({
  totalProjects,
  totalCategories,
  totalTechnologies,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'year' | 'name'>(
    'featured'
  );

  // Filter and sort projects on the client side
  useEffect(() => {
    const projectCards = document.querySelectorAll('[data-project-id]');
    let visibleCount = 0;

    projectCards.forEach(card => {
      const element = card as HTMLElement;
      const projectTitle = element.dataset.projectTitle || '';
      const projectTechnologies = element.dataset.projectTechnologies || '';
      const projectCategory = element.dataset.projectCategory || '';

      // Search filter - check title, technologies, and description
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        projectTitle.includes(searchLower) ||
        projectTechnologies.includes(searchLower) ||
        element.textContent?.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || projectCategory === selectedCategory;

      // Show/hide based on filters
      if (matchesSearch && matchesCategory) {
        element.style.display = '';
        visibleCount++;
      } else {
        element.style.display = 'none';
      }
    });

    // Update results count
    const resultsElement = document.getElementById('results-count');
    if (resultsElement) {
      resultsElement.textContent = `${visibleCount} project${visibleCount !== 1 ? 's' : ''} found`;
    }
  }, [searchTerm, selectedCategory]);

  // Sort projects
  useEffect(() => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const projectCards = Array.from(grid.children) as HTMLElement[];

    projectCards.sort((a, b) => {
      const aFeatured = a.querySelector?.('[data-featured]') != null;
      const bFeatured = b.querySelector?.('[data-featured]') != null;
      const aTitle = a.dataset.projectTitle || '';
      const bTitle = b.dataset.projectTitle || '';
      const aYear = Number(a.dataset.projectYear) || 0;
      const bYear = Number(b.dataset.projectYear) || 0;

      switch (sortBy) {
        case 'featured':
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
          return aTitle.localeCompare(bTitle);
        case 'name':
          return aTitle.localeCompare(bTitle);
        case 'year':
          if (aYear !== bYear) return bYear - aYear;
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });

    // Re-append sorted elements
    projectCards.forEach(card => grid.appendChild(card));
  }, [sortBy]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-border py-8">
        <div>
          <p className="text-3xl font-display font-medium tracking-tight text-foreground">
            {totalProjects}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Total Projects
          </p>
        </div>

        <div>
          <p className="text-3xl font-display font-medium tracking-tight text-foreground">
            {totalCategories}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Categories
          </p>
        </div>

        <div>
          <p className="text-3xl font-display font-medium tracking-tight text-foreground">
            {totalTechnologies}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Technologies
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-t border-border pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="contact-input pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="contact-input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={e =>
                setSortBy(e.target.value as 'featured' | 'year' | 'name')
              }
              className="contact-input"
            >
              <option value="featured">Featured First</option>
              <option value="year">Newest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            <span id="results-count">{totalProjects} projects found</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsInteractivity;
