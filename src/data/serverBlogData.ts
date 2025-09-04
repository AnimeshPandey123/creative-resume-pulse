import { promises as fsp } from 'fs';
import path from 'path';
import { BlogPost } from '@/types/BlogTypes';
import { blogPosts } from './mockBlogData';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'blog');

function resolveContentPath(relativeOrAbsolute: string | undefined, slug: string): string {
  const candidate = relativeOrAbsolute
    ? (path.isAbsolute(relativeOrAbsolute)
      ? relativeOrAbsolute
      : path.join(process.cwd(), relativeOrAbsolute.replace(/^\/+/, '')))
    : path.join(CONTENT_ROOT, `${slug}.md`);

  // Enforce that resolved path stays within CONTENT_ROOT to prevent traversal
  const normalized = path.normalize(candidate);
  if (!normalized.startsWith(CONTENT_ROOT)) {
    return path.join(CONTENT_ROOT, `${slug}.md`);
  }
  return normalized;
}

// simple in-memory cache for build/SSR lifecycle
const mdCache = new Map<string, string>();

// Read markdown content for a given slug on the server
export const fetchBlogPostWithContentBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const basePost = blogPosts.find(post => post.slug === slug);
  if (!basePost) return undefined;

  // Read the blog-posts.json file directly using fs instead of import
  const blogPostsPath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  let blogData;

  try {
    const blogDataRaw = await fsp.readFile(blogPostsPath, 'utf-8');
    blogData = JSON.parse(blogDataRaw);
  } catch {
    // If we can't read the JSON file, return the base post
    return basePost;
  }
  const mdRelative: string | undefined = blogData.posts.find((p: any) => p.slug === slug)?.contentPath;

  const mdPath = resolveContentPath(mdRelative, slug);

  try {
    let raw = mdCache.get(mdPath);
    if (!raw) {
      raw = await fsp.readFile(mdPath, 'utf-8');
      mdCache.set(mdPath, raw);
    }
    const { content, data } = matter(raw);
    // Merge optional frontmatter, preferring JSON metadata when present
    const merged: BlogPost = {
      ...basePost,
      title: data.title ?? basePost.title,
      excerpt: data.excerpt ?? basePost.excerpt,
      publishDate: data.publishDate ?? basePost.publishDate,
      // tags and author merging would require ids; keep JSON as source of truth
      content,
    } as BlogPost;
    return merged;
  } catch {
    return basePost;
  }
};

