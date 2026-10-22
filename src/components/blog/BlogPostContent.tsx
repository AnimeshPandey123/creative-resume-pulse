'use client';

import React, { useMemo } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/BlogTypes';
import { formatPublishDate, getReadingTimeLabel } from '@/lib/blog';
import { splitMarkdownParts } from '@/lib/markdownParts';
import { MarkdownPartRenderer } from './MarkdownPartRenderer';

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const parts = useMemo(
    () => splitMarkdownParts(post.content || ''),
    [post.content]
  );

  return (
    <article className="max-w-3xl mx-auto">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </nav>

      <div className="mb-8 rounded-xl overflow-hidden">
        <Image
          src={post.coverImage}
          alt={`Cover image for ${post.title}`}
          width={1200}
          height={630}
          className="w-full h-auto object-cover max-h-[500px]"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishDate}>
              {formatPublishDate(post.publishDate)}
            </time>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{getReadingTimeLabel(post.readingTime)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link key={tag.id} href={`/blog/?tag=${tag.slug}`}>
              <Badge
                variant="outline"
                className="hover:bg-accent transition-colors cursor-pointer"
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl glass-card mb-8">
        <Avatar className="h-12 w-12">
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">{post.author.bio}</p>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-table:my-6 prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3">
        {parts.map((part, index) => (
          <MarkdownPartRenderer key={`${part.type}-${index}`} part={part} />
        ))}
      </div>
    </article>
  );
};

export default BlogPostContent;
