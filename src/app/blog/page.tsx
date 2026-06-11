import { Suspense } from 'react';
import Layout from '@/layout/Layout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { blogMetadata, blogPageStructuredData } from '@/config/seo';
import { blogPosts, blogTags } from '@/data/mockBlogData';

export const metadata = blogMetadata;

export default function BlogPage() {
  // Get data at build time (server-side) - similar to projects page
  const allPosts = blogPosts;

  // Calculate stats
  const blogStats = {
    totalPosts: allPosts.length,
    totalTags: blogTags.length,
  };

  // Get all unique tags
  const allTags = blogTags;

  return (
    <>
      {/* Structured Data for Blog Page */}
      {blogPageStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}

      <Layout>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <p className="text-muted-foreground">Loading blog...</p>
            </div>
          }
        >
          <BlogPageClient posts={allPosts} tags={allTags} stats={blogStats} />
        </Suspense>
      </Layout>
    </>
  );
}
