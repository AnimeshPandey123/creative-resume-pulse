'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from '@/types/BlogTypes';
import { Badge } from '@/components/ui/badge';
import { formatPublishDate, getReadingTimeLabel } from '@/lib/blog';

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
  showImmediately?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  index = 0,
  showImmediately = false,
}) => {
  const { title, excerpt, slug, publishDate, readingTime, tags } = post;

  return (
    <article
      className={`index-row${showImmediately ? '' : ' blog-card-pending'}`}
      style={{ animationDelay: `${index * 100}ms` }}
      data-blog-card
    >
      <div className="md:col-span-3">
        <time
          dateTime={publishDate}
          className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
        >
          {formatPublishDate(publishDate)}
        </time>
        <p className="mt-2 text-xs text-muted-foreground">
          {getReadingTimeLabel(readingTime)}
        </p>
      </div>
      <div className="md:col-span-8">
        <Link href={`/blog/${slug}/`} className="block">
          <h3 className="text-xl font-medium tracking-tight leading-tight hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {excerpt}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map(tag => (
            <Link key={tag.id} href={`/blog/?tag=${tag.slug}`}>
              <Badge
                variant="outline"
                className="rounded-none border-0 bg-transparent px-0 py-0 font-normal text-muted-foreground hover:bg-transparent hover:text-primary"
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex md:col-span-1 md:justify-end">
        <Link
          href={`/blog/${slug}/`}
          aria-label={`Read ${title}`}
          className="text-foreground/70 hover:text-foreground"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default BlogPostCard;
