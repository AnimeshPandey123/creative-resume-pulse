
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { fetchBlogPostBySlug, fetchRelatedPosts } from '@/data/mockBlogData';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = slug ? fetchBlogPostBySlug(slug) : null;
  const relatedPosts = post ? fetchRelatedPosts(post.id, 3) : [];
  
  // Redirect to blog listing if post not found
  useEffect(() => {
    if (slug && !post) {
      navigate('/blog', { replace: true });
    }
  }, [slug, post, navigate]);
  
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (!post) {
    return null; // Will redirect in useEffect
  }

  // Extract the first paragraph from content for meta description
  const getMetaDescription = () => {
    const firstParagraph = post.content
      .split('\n')
      .find(line => line.trim() && !line.startsWith('#'))
      ?.trim();
    
    return firstParagraph?.substring(0, 160) || post.excerpt;
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | Animesh Pandey</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:author" content={post.author.name} />
        {post.tags.map(tag => (
          <meta key={tag.id} property="article:tag" content={tag.name} />
        ))}
        <link rel="canonical" href={`https://animeshpandey.com/blog/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.coverImage,
            "datePublished": post.publishDate,
            "author": {
              "@type": "Person",
              "name": post.author.name
            },
            "publisher": {
              "@type": "Person",
              "name": "Animesh Pandey"
            },
            "description": post.excerpt
          })}
        </script>
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="container">
          <BlogPostContent post={post} />
          <RelatedPosts posts={relatedPosts} />
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
