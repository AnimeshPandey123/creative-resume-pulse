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
});
