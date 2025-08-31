import { fetchBlogPosts, fetchBlogPostBySlug, fetchRelatedPosts, blogPosts } from '@/data/mockBlogData'

describe('mockBlogData utilities', () => {
  it('paginates and filters by search and tag', () => {
    const { posts: page1, totalPages } = fetchBlogPosts(1, 2)
    expect(page1.length).toBeLessThanOrEqual(2)
    expect(totalPages).toBeGreaterThan(0)

    const { posts: searchPosts } = fetchBlogPosts(1, 10, 'the')
    expect(searchPosts.length).toBeGreaterThanOrEqual(0)

    const someTag = blogPosts[0]?.tags[0]?.slug
    if (someTag) {
      const { posts: tagged } = fetchBlogPosts(1, 10, '', someTag)
      expect(tagged.every(p => p.tags.some(t => t.slug === someTag))).toBe(true)
    }
  })

  it('fetches by slug and related posts', async () => {
    const first = blogPosts[0]
    const bySlug = await fetchBlogPostBySlug(first.slug)
    expect(bySlug?.id).toBe(first.id)

    const related = await fetchRelatedPosts(first.id, 2)
    expect(Array.isArray(related)).toBe(true)
  })
})

