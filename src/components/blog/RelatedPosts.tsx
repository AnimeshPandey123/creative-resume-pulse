"use client";

import React from 'react';
import { BlogPost } from '@/types/BlogTypes';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 bg-card dark:bg-gray-800/80 border border-border dark:border-gray-700/20">
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden h-40">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={300}
                height={160}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </Link>
            <CardContent className="flex-grow p-4 space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{post.publishDate}</span>
                <span className="ml-auto">{post.readingTime} min read</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
