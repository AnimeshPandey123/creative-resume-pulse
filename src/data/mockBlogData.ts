import { BlogAuthor, BlogPost, BlogTag } from '../types/BlogTypes';

// Import JSON data
const blogData = require('./blog-posts.json');

// Load data from JSON file
const { authors, tags, posts } = blogData;

export const blogAuthors: BlogAuthor[] = authors;
export const blogTags: BlogTag[] = tags;

// Transform posts to include author and tags objects
export const blogPosts: BlogPost[] = posts.map((post: any) => ({
  ...post,
  author: blogAuthors.find(author => author.id === post.authorId)!,
  tags: blogTags.filter(tag => post.tagIds.includes(tag.id)),
}));

export const fetchBlogPosts = (page = 1, limit = 10, search = '', tag = '') => {
  let filteredPosts = [...blogPosts];

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
    );
  }

  // Filter by tag
  if (tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(t => t.slug === tag)
    );
  }

  // Sort by publish date (newest first)
  filteredPosts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    totalPosts,
    totalPages,
    currentPage: page,
  };
};

export const fetchBlogPostBySlug = async (slug: string) => {
  return blogPosts.find(post => post.slug === slug);
};

export const fetchRelatedPosts = async (currentPostId: string, limit = 3) => {
  const currentPost = blogPosts.find(post => post.id === currentPostId);
  if (!currentPost) return [];

  const currentPostTagIds = currentPost.tags.map(tag => tag.id);

  return blogPosts
    .filter(post => post.id !== currentPostId)
    .map(post => {
      const commonTags = post.tags.filter(tag =>
        currentPostTagIds.includes(tag.id)
      );
      return { post, relevance: commonTags.length };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map(item => item.post);
};
