'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/BlogTypes';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatPublishDate, getReadingTimeLabel } from '@/lib/blog';

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, index = 0 }) => {
  const { title, excerpt, coverImage, slug, publishDate, readingTime, tags } =
    post;

  return (
    <article
      className="project-card h-full flex flex-col opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
      data-blog-card
    >
      <Link href={`/blog/${slug}/`} className="block overflow-hidden h-48">
        <Image
          src={coverImage}
          alt={title}
          width={400}
          height={200}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <CardContent className="flex-grow p-5 space-y-3">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={publishDate}>{formatPublishDate(publishDate)}</time>
          </div>
          <span className="text-xs text-muted-foreground">
            {getReadingTimeLabel(readingTime)}
          </span>
        </div>
        <Link href={`/blog/${slug}/`} className="block">
          <h3 className="text-xl font-semibold mb-2 leading-tight hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex flex-wrap gap-2">
        {tags.slice(0, 3).map(tag => (
          <Link key={tag.id} href={`/blog/?tag=${tag.slug}`}>
            <Badge
              variant="outline"
              className="hover:bg-accent transition-colors cursor-pointer"
            >
              {tag.name}
            </Badge>
          </Link>
        ))}
      </CardFooter>
    </article>
  );
};

export default BlogPostCard;
