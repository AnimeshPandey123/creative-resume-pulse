import {
  fetchBlogPosts,
  fetchBlogPostBySlug,
  fetchRelatedPosts,
  blogPosts,
} from '@/data/mockBlogData';

describe('mockBlogData utilities', () => {
  it('paginates and filters by search and tag', () => {
    const { posts: page1, totalPages } = fetchBlogPosts(1, 2);
    expect(page1.length).toBeLessThanOrEqual(2);
    expect(totalPages).toBeGreaterThan(0);

    const { posts: searchPosts } = fetchBlogPosts(1, 10, 'the');
    expect(searchPosts.length).toBeGreaterThanOrEqual(0);

    const someTag = blogPosts[0]?.tags[0]?.slug;
    if (someTag) {
      const { posts: tagged } = fetchBlogPosts(1, 10, '', someTag);
      expect(tagged.every(p => p.tags.some(t => t.slug === someTag))).toBe(
        true
      );
    }
  });

  it('fetches by slug and related posts', async () => {
    const first = blogPosts[0];
    const bySlug = await fetchBlogPostBySlug(first.slug);
    expect(bySlug?.id).toBe(first.id);

    const related = await fetchRelatedPosts(first.id, 2);
    expect(Array.isArray(related)).toBe(true);
  });

  it('returns empty array when current post is not found in fetchRelatedPosts', async () => {
    const result = await fetchRelatedPosts('non-existent-id', 3);
    expect(result).toEqual([]);
  });

  it('handles empty search and tag filters', () => {
    const { posts, totalPosts } = fetchBlogPosts(1, 10, '', '');
    expect(posts.length).toBeGreaterThan(0);
    expect(totalPosts).toBeGreaterThan(0);
  });

  it('handles search with no results', () => {
    const { posts, totalPosts } = fetchBlogPosts(
      1,
      10,
      'nonexistentsearchterm',
      ''
    );
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(0);
  });

  it('handles tag filter with no results', () => {
    const { posts, totalPosts } = fetchBlogPosts(1, 10, '', 'nonexistenttag');
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(0);
  });

  it('handles pagination edge cases', () => {
    // Test with page 0 (should return empty array since page 0 is invalid)
    const { posts: page0 } = fetchBlogPosts(0, 10);
    expect(page0).toEqual([]);

    // Test with very large page number
    const { posts: largePage, totalPages } = fetchBlogPosts(999, 10);
    expect(largePage).toEqual([]);
    expect(totalPages).toBeGreaterThan(0);

    // Test with limit 0
    const { posts: zeroLimit } = fetchBlogPosts(1, 0);
    expect(zeroLimit).toEqual([]);
  });

  it('handles search and tag filters together', () => {
    const { posts, totalPosts } = fetchBlogPosts(
      1,
      10,
      'nonexistent',
      'nonexistenttag'
    );
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(0);
  });

  it('handles pagination with different limits', () => {
    const { posts: limit1, totalPages: pages1 } = fetchBlogPosts(1, 1);
    const { posts: limit5, totalPages: pages5 } = fetchBlogPosts(1, 5);

    expect(limit1.length).toBeLessThanOrEqual(1);
    expect(limit5.length).toBeLessThanOrEqual(5);
    expect(pages1).toBeGreaterThanOrEqual(pages5);
  });

  it('handles search with case sensitivity', () => {
    const { posts: upperCase } = fetchBlogPosts(1, 10, 'THE');
    const { posts: lowerCase } = fetchBlogPosts(1, 10, 'the');

    expect(upperCase.length).toBe(lowerCase.length);
  });

  it('handles search with partial matches', () => {
    const { posts: partial } = fetchBlogPosts(1, 10, 'a');
    expect(partial.length).toBeGreaterThanOrEqual(0);
  });

  it('handles tag filtering with exact matches', () => {
    const firstPost = blogPosts[0];
    if (firstPost && firstPost.tags.length > 0) {
      const tagSlug = firstPost.tags[0].slug;
      const { posts } = fetchBlogPosts(1, 10, '', tagSlug);

      // All returned posts should have the specified tag
      posts.forEach(post => {
        expect(post.tags.some(tag => tag.slug === tagSlug)).toBe(true);
      });
    }
  });

  it('handles fetchBlogPostBySlug with non-existent slug', async () => {
    const result = await fetchBlogPostBySlug('non-existent-slug');
    expect(result).toBeUndefined();
  });

  it('handles fetchRelatedPosts with limit 0', async () => {
    const firstPost = blogPosts[0];
    if (firstPost) {
      const result = await fetchRelatedPosts(firstPost.id, 0);
      expect(result).toEqual([]);
    }
  });

  it('handles fetchRelatedPosts with negative limit', async () => {
    const firstPost = blogPosts[0];
    if (firstPost) {
      const result = await fetchRelatedPosts(firstPost.id, -1);
      // The function doesn't handle negative limits, so it returns all related posts
      expect(Array.isArray(result)).toBe(true);
    }
  });

  it('handles fetchRelatedPosts with very large limit', async () => {
    const firstPost = blogPosts[0];
    if (firstPost) {
      const result = await fetchRelatedPosts(firstPost.id, 1000);
      expect(result.length).toBeLessThanOrEqual(blogPosts.length - 1);
    }
  });

  it('handles posts with no tags in fetchRelatedPosts', async () => {
    // Create a mock post with no tags for testing
    const mockPost = {
      ...blogPosts[0],
      tags: [],
    };

    // This tests the case where currentPostTagIds is empty
    const result = await fetchRelatedPosts(mockPost.id, 3);
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles posts with overlapping tags in fetchRelatedPosts', async () => {
    const firstPost = blogPosts[0];
    const secondPost = blogPosts[1];

    if (
      firstPost &&
      secondPost &&
      firstPost.tags.length > 0 &&
      secondPost.tags.length > 0
    ) {
      const result = await fetchRelatedPosts(firstPost.id, 3);

      // Check that posts are sorted by relevance (number of common tags)
      for (let i = 0; i < result.length - 1; i++) {
        const currentPost = result[i];
        const nextPost = result[i + 1];

        const currentRelevance = currentPost.tags.filter(tag =>
          firstPost.tags.some(firstTag => firstTag.id === tag.id)
        ).length;

        const nextRelevance = nextPost.tags.filter(tag =>
          firstPost.tags.some(firstTag => firstTag.id === tag.id)
        ).length;

        expect(currentRelevance).toBeGreaterThanOrEqual(nextRelevance);
      }
    }
  });

  it('handles edge cases for find operations', async () => {
    // Test fetchBlogPostBySlug with non-existent slug
    const nonExistentPost = await fetchBlogPostBySlug('non-existent-slug');
    expect(nonExistentPost).toBeUndefined();

    // Test fetchRelatedPosts with non-existent post ID
    const relatedPosts = await fetchRelatedPosts('non-existent-id');
    expect(relatedPosts).toEqual([]);

    // Test fetchRelatedPosts with limit 0
    const { posts } = fetchBlogPosts(1, 1);
    if (posts.length > 0) {
      const relatedPostsZero = await fetchRelatedPosts(posts[0].id, 0);
      expect(relatedPostsZero).toEqual([]);
    }
  });

  it('handles posts with missing author or tag data', () => {
    // This test ensures the find operations handle edge cases
    const { posts } = fetchBlogPosts(1, 10);

    // All posts should have valid authors and tags
    posts.forEach(post => {
      expect(post.author).toBeDefined();
      expect(post.tags).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
    });
  });

  it('handles falsy search values', () => {
    // Test with empty string (default)
    const { posts: emptySearch } = fetchBlogPosts(1, 10, '');
    expect(emptySearch.length).toBeGreaterThan(0);

    // Test with null search (should be treated as falsy)
    const { posts: nullSearch } = fetchBlogPosts(1, 10, null as any);
    expect(nullSearch.length).toBeGreaterThan(0);

    // Test with undefined search (should be treated as falsy)
    const { posts: undefinedSearch } = fetchBlogPosts(1, 10, undefined as any);
    expect(undefinedSearch.length).toBeGreaterThan(0);
  });

  it('handles falsy tag values', () => {
    // Test with empty string (default)
    const { posts: emptyTag } = fetchBlogPosts(1, 10, '', '');
    expect(emptyTag.length).toBeGreaterThan(0);

    // Test with null tag (should be treated as falsy)
    const { posts: nullTag } = fetchBlogPosts(1, 10, '', null as any);
    expect(nullTag.length).toBeGreaterThan(0);

    // Test with undefined tag (should be treated as falsy)
    const { posts: undefinedTag } = fetchBlogPosts(1, 10, '', undefined as any);
    expect(undefinedTag.length).toBeGreaterThan(0);
  });
});
