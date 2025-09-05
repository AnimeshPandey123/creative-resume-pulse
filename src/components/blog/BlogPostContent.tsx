'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/BlogTypes';
import CodeBlock from './CodeBlock';

interface BlogPostContentProps {
  post: BlogPost;
}

// Define the type for code block props
interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Cover image */}
      <div className="mb-8 rounded-lg overflow-hidden">
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

      {/* Post metadata */}
      <div className="space-y-4 mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight"
          style={{ fontSize: '2.25rem' }}
        >
          {post.title}
        </h1>

        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{post.publishDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
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

      {/* Author info */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-card dark:bg-gray-800/50 border border-border mb-8">
        <Avatar className="h-12 w-12">
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">{post.author.bio}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code: ({ inline, className, children, ...props }: CodeProps) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock language={match[1]} className={className} {...props}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content || ''}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default BlogPostContent;
