'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '@/data/mockBlogData';
import { blogSectionData } from '@/data/landingData';
import { formatPublishDate } from '@/lib/blog';

const LatestWriting: React.FC = () => {
  const posts = blogPosts.slice(0, blogSectionData.limit);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="writing"
      className="py-20 bg-background"
      role="region"
      aria-labelledby="writing-heading"
    >
      <div className="section-container">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-kicker mb-4">Notes / public work</p>
            <h2 id="writing-heading" className="section-title">
              {blogSectionData.title}
            </h2>
          </div>
          <p className="section-subtitle md:col-span-5">
            {blogSectionData.subtitle}
          </p>
        </header>

        <ul className="list-none">
          {posts.map(post => (
            <li key={post.id} className="index-row">
              <time
                dateTime={post.publishDate}
                className="text-xs uppercase tracking-[0.14em] text-muted-foreground md:col-span-3"
              >
                {formatPublishDate(post.publishDate)}
              </time>
              <h3 className="text-xl font-medium tracking-tight md:col-span-7">
                <Link
                  href={`/blog/${post.slug}/`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <div className="flex justify-end md:col-span-2">
                <Link
                  href={`/blog/${post.slug}/`}
                  aria-label={`Read ${post.title}`}
                  className="text-foreground/70 hover:text-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-border pt-6">
          <Link href="/blog/" className="text-link">
            {blogSectionData.viewAllText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestWriting;
