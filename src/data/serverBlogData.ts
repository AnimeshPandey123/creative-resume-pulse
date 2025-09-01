import fs from 'fs';
import path from 'path';
import { BlogPost } from '@/types/BlogTypes';
import { blogPosts } from './mockBlogData';

// Read markdown content for a given slug on the server
export const fetchBlogPostWithContentBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const basePost = blogPosts.find(post => post.slug === slug);
  if (!basePost) return undefined;

  const blogData = require('./blog-posts.json');
  const mdRelative: string | undefined = blogData.posts.find((p: any) => p.slug === slug)?.contentPath;

  const mdPath = mdRelative
    ? (path.isAbsolute(mdRelative) ? mdRelative : path.join(process.cwd(), mdRelative.replace(/^\//, '')))
    : path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);

  try {
    const content = fs.readFileSync(mdPath, 'utf-8');
    return { ...basePost, content };
  } catch {
    return basePost;
  }
};

