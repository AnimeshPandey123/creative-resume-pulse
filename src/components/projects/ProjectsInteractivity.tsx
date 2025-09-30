'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        element.style.display = 'block';
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
      const aFeatured = a.querySelector('[data-featured]') !== null;
      const bFeatured = b.querySelector('[data-featured]') !== null;
      const aTitle = a.dataset.projectTitle || '';
      const bTitle = b.dataset.projectTitle || '';

      switch (sortBy) {
        case 'featured':
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
          return aTitle.localeCompare(bTitle);
        case 'name':
          return aTitle.localeCompare(bTitle);
        case 'year':
          // For year sorting, we'd need to add year data attributes
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });

    // Re-append sorted elements
    projectCards.forEach(card => grid.appendChild(card));
  }, [sortBy]);

  // Toggle view mode
  const toggleViewMode = () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (viewMode === 'grid') {
      grid.className = 'grid grid-cols-1 gap-8';
      setViewMode('list');
    } else {
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      setViewMode('grid');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Filter className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCategories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Filter className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Technologies
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTechnologies}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="featured">Featured First</option>
              <option value="year">Newest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={toggleViewMode}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
              }`}
              title="Toggle view mode"
            >
              {viewMode === 'grid' ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span id="results-count">{totalProjects} projects found</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsInteractivity;
