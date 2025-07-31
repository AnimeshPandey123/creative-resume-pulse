"use client";

import React from 'react';
import { BlogPost } from '@/types/BlogTypes';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
        <img
          src={post.coverImage}
          alt={`Cover image for ${post.title}`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={1200}
          height={630}
        />
      </div>

      {/* Post metadata */}
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>

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
              <Badge variant="outline" className="hover:bg-accent transition-colors cursor-pointer">
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
                <SyntaxHighlighter
                  // @ts-ignore - Working around type issues with react-syntax-highlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default BlogPostContent;
