'use client';

import { useSearchParams } from 'next/navigation';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogTagFilter from '@/components/blog/BlogTagFilter';
import BlogPagination from '@/components/blog/BlogPagination';
import { fetchBlogPosts, blogTags } from '@/data/mockBlogData';

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get('page') ?? 1) || 1;
  const search = searchParams?.get('search') ?? '';
  const tag = searchParams?.get('tag') ?? '';

  const postsPerPage = 6;
  const { posts, totalPages, currentPage } = fetchBlogPosts(
    page,
    postsPerPage,
    search,
    tag
  );

  const currentTagName = tag
    ? blogTags.find(t => t.slug === tag)?.name || tag
    : '';

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
            {tag
              ? `Exploring articles about ${currentTagName}`
              : 'Thoughts, ideas, and tutorials to inspire and inform'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
          <BlogSearch />
          <BlogTagFilter />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-secondary/50 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search term or removing filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            <BlogPagination totalPages={totalPages} currentPage={currentPage} />
          </>
        )}
      </div>
    </section>
  );
}
