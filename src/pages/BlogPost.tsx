
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import SEO from '@/components/SEO';
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

  // Generate structured data for the blog post
  const generateStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate, // Assuming same as published for now
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": "https://animeshpandey.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Animesh Pandey",
      "url": "https://animeshpandey.com"
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://animeshpandey.com/blog/${slug}`
    },
    "keywords": post.tags.map(tag => tag.name).join(', '),
    "articleSection": post.tags.length > 0 ? post.tags[0].name : "Technology",
    "wordCount": post.content.split(' ').length
  });

  return (
    <>
      <SEO
        title={`${post.title} | Animesh Pandey`}
        description={getMetaDescription()}
        keywords={[
          ...post.tags.map(tag => tag.name),
          'Blog',
          'Web Development',
          'Programming',
          'Technology',
          'Animesh Pandey'
        ]}
        image={post.coverImage}
        url={`https://animeshpandey.com/blog/${slug}`}
        type="article"
        author={post.author.name}
        publishedTime={post.publishDate}
        modifiedTime={post.publishDate}
        section={post.tags.length > 0 ? post.tags[0].name : "Technology"}
        tags={post.tags.map(tag => tag.name)}
        structuredData={generateStructuredData()}
      />
      <Layout>
        <section className="py-12 md:py-16">
          <div className="container">
            <BlogPostContent post={post} />
            <RelatedPosts posts={relatedPosts} />
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BlogPost;
