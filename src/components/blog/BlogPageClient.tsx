'use client';

import { useState, useEffect } from 'react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogTagFilter from '@/components/blog/BlogTagFilter';
import type { BlogPost, BlogTag } from '@/types/BlogTypes';

interface BlogStats {
  totalPosts: number;
  totalTags: number;
}

interface BlogPageClientProps {
  posts: BlogPost[];
  tags: BlogTag[];
  stats: BlogStats;
}

export default function BlogPageClient({
  posts,
  tags,
  stats,
}: BlogPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(posts.length);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const postsPerPage = 6;

  // Filter posts and handle pagination
  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.slug === selectedTag)
      );
    }

    setFilteredPosts(filtered);
    setVisibleCount(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedTag, posts]);

  // Calculate pagination
  const totalPages = Math.ceil(visibleCount / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <section className="pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="container">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1
              className="text-4xl md:text-5xl font-bold text-foreground"
              style={{ fontSize: '2.25rem' }}
            >
              Blog
            </h1>
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              title="Subscribe to RSS feed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.5 3.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9zM5 5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5z" />
                <path d="M3.5 15.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM3.5 19.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM7.5 19.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM11.5 19.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM15.5 19.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM19.5 19.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1z" />
              </svg>
              RSS Feed
            </a>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {selectedTag
              ? `Exploring articles about ${tags.find(t => t.slug === selectedTag)?.name || selectedTag}`
              : 'Thoughts, ideas, and tutorials to inspire and inform'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
          <BlogSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <BlogTagFilter
            tags={tags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
          />
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            <span id="results-count">{visibleCount}</span> post
            {visibleCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {visibleCount === 0 ? (
          <div className="text-center py-16 bg-secondary/50 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search term or removing filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                              ? 'bg-primary text-primary-foreground'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
