'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { blogPosts } from '@/data/mockBlogData';
import { blogSectionData } from '@/data/landingData';

const LatestWriting: React.FC = () => {
  const posts = blogPosts.slice(0, blogSectionData.limit);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="writing"
      className="py-20 bg-white dark:bg-gray-900"
      role="region"
      aria-labelledby="writing-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="writing-heading" className="section-title">
            {blogSectionData.title}
          </h2>
          <p className="section-subtitle">{blogSectionData.subtitle}</p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard
              key={post.id}
              post={post}
              index={index}
              showImmediately
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {blogSectionData.viewAllText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestWriting;
