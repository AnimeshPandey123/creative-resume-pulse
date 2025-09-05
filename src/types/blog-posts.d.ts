declare module '*/blog-posts.json' {
  interface BlogPostData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    contentPath?: string;
    coverImage: string;
    publishDate: string;
    readingTime: number;
    authorId: string;
    tagIds: string[];
  }

  interface BlogAuthorData {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string;
  }

  interface BlogTagData {
    id: string;
    name: string;
    slug: string;
  }

  interface BlogData {
    authors: BlogAuthorData[];
    tags: BlogTagData[];
    posts: BlogPostData[];
  }

  const value: BlogData;
  export default value;
}
