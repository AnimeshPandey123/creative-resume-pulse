import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/layout/Layout';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogTagFilter from '@/components/blog/BlogTagFilter';
import BlogPagination from '@/components/blog/BlogPagination';
import { fetchBlogPosts, blogTags } from '@/data/mockBlogData';

const Blog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  
  const postsPerPage = 6;
  const { posts, totalPages, currentPage } = fetchBlogPosts(page, postsPerPage, search, tag);
  
  const currentTagName = tag ? 
    blogTags.find(t => t.slug === tag)?.name || tag : 
    '';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const generateTitle = () => {
    if (search && tag) {
      return `Search: ${search} in ${currentTagName} | Blog`;
    }
    if (search) {
      return `Search: ${search} | Blog`;
    }
    if (tag) {
      return `${currentTagName} | Blog`;
    }
    return 'Blog | Animesh Pandey';
  };

  return (
    <Layout>
      <Helmet>
        <title>{generateTitle()}</title>
        <meta 
          name="description" 
          content="Explore articles on web development, programming, and technology by Animesh Pandey." 
        />
        <meta 
          property="og:title" 
          content={generateTitle()} 
        />
        <meta 
          property="og:description" 
          content="Explore articles on web development, programming, and technology by Animesh Pandey." 
        />
        <meta 
          property="og:type" 
          content="website" 
        />
        <link 
          rel="canonical" 
          href={`https://animeshpandey.com/blog${window.location.search}`} 
        />
      </Helmet>

      <section className="pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {tag ? `Exploring articles about ${currentTagName}` : 'Thoughts, ideas, and tutorials to inspire and inform'}
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
              
              <BlogPagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
