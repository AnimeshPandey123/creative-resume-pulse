'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookOpen, Rss, Tag } from 'lucide-react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogTagFilter from '@/components/blog/BlogTagFilter';
import BlogPagination from '@/components/blog/BlogPagination';
import { Button } from '@/components/ui/button';
import { BLOG_CONFIG } from '@/config/seo';
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

function parsePageParam(value: string | null): number {
  const page = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default function BlogPageClient({
  posts,
  tags,
  stats,
}: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = searchParams ?? new URLSearchParams();

  const searchTerm = params.get('search') ?? '';
  const selectedTag = params.get('tag') ?? '';
  const currentPage = parsePageParam(params.get('page'));

  const postsPerPage = BLOG_CONFIG.postsPerPage;

  const availableTags = useMemo(() => {
    const usedSlugs = new Set(
      posts.flatMap(post => post.tags.map(tag => tag.slug))
    );
    return tags.filter(tag => usedSlugs.has(tag.slug));
  }, [posts, tags]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.slug === selectedTag)
      );
    }

    return filtered;
  }, [posts, searchTerm, selectedTag]);

  const visibleCount = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(visibleCount / postsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const selectedTagName =
    tags.find(tag => tag.slug === selectedTag)?.name ?? selectedTag;

  const updateQuery = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if ('search' in updates || 'tag' in updates) {
      nextParams.delete('page');
    }

    const query = nextParams.toString();
    router.push(query ? `/blog/?${query}` : '/blog/');
  };

  const clearFilters = () => {
    router.push('/blog/');
  };

  const hasActiveFilters = Boolean(searchTerm || selectedTag);

  useEffect(() => {
    const cards = document.querySelectorAll('[data-blog-card]');

    const revealCard = (card: Element) => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      card.classList.remove('blog-card-pending');
      card.classList.add('animate-fade-in');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(revealCard);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealCard(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [paginatedPosts]);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 page-hero-gradient">
        <div className="section-container pb-1">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
              Engineering Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {selectedTag
                ? `Articles about ${selectedTagName}`
                : 'Practical notes on backend systems, full-stack development, DevOps, and AI integration.'}
            </p>
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              title="Subscribe to RSS feed"
            >
              <Rss className="w-4 h-4" />
              RSS Feed
            </a>
          </div>
        </div>
      </section>

      <section className="pt-8 pb-4">
        <div className="section-container pt-1 pb-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalPosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Topics
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalTags}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Rss className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Showing
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {visibleCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <BlogSearch
                searchTerm={searchTerm}
                onSearchChange={value =>
                  updateQuery({ search: value.trim() || null })
                }
              />
              <BlogTagFilter
                tags={availableTags}
                selectedTag={selectedTag}
                onTagChange={value => updateQuery({ tag: value || null })}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16">
        <div className="section-container pt-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-muted-foreground">
              <span id="results-count">{visibleCount}</span> post
              {visibleCount !== 1 ? 's' : ''} found
              {hasActiveFilters ? ' with current filters' : ''}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>

          {visibleCount === 0 ? (
            <div className="text-center py-16 glass-card">
              <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your search term or removing filters to browse all
                articles.
              </p>
              <Button onClick={clearFilters}>View all posts</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPosts.map((post, index) => (
                  <BlogPostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              <BlogPagination
                totalPages={totalPages}
                currentPage={safeCurrentPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
