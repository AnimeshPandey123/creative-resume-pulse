import React from 'react'
import { render } from '@testing-library/react'
import BlogPostPage, { generateMetadata, generateStaticParams } from '../page'
import { generateBlogPostMetadata, generateBlogPostStructuredData } from '@/config/seo'

// Suppress console.error for expected error scenarios in tests
const originalError = console.error
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (typeof args[0] === 'string' && (
            args[0].includes('Error rendering blog post:') ||
            args[0].includes('Error generating metadata for blog post:')
        )) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

// Mock the data functions
jest.mock('@/data/mockBlogData', () => ({
    fetchBlogPostBySlug: jest.fn(),
    fetchRelatedPosts: jest.fn(),
    blogPosts: [
        { slug: 'test-post-1' },
        { slug: 'test-post-2' },
        { slug: 'test-post-3' },
    ],
}))

// Mock the components
jest.mock('@/layout/Layout', () => {
    return function MockLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="layout">{children}</div>
    }
})

jest.mock('@/components/blog/BlogPostContent', () => {
    return function MockBlogPostContent({ post }: { post: any }) {
        return <div data-testid="blog-post-content">{post.title}</div>
    }
})

jest.mock('@/components/blog/RelatedPosts', () => {
    return function MockRelatedPosts({ posts }: { posts: any[] }) {
        return <div data-testid="related-posts">Related Posts ({posts.length})</div>
    }
})

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}))

describe('BlogPostPage', () => {
    const mockPost = {
        id: '1',
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post excerpt',
        content: 'This is the full content of the test blog post',
        slug: 'test-blog-post',
        publishDate: '2024-01-01T00:00:00Z',
        coverImage: 'https://example.com/image.jpg',
        author: {
            name: 'Animesh Pandey',
            email: 'animesh@example.com',
        },
        tags: [
            { name: 'JavaScript' },
            { name: 'React' },
        ],
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render blog post content', async () => {
        const { fetchBlogPostBySlug, fetchRelatedPosts } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockResolvedValue(mockPost)
        fetchRelatedPosts.mockResolvedValue([])

        const { getByTestId } = render(
            await BlogPostPage({ params: Promise.resolve({ slug: 'test-blog-post' }) })
        )

        expect(getByTestId('blog-post-content')).toBeInTheDocument()
        expect(getByTestId('related-posts')).toBeInTheDocument()
    })

    it('should include structured data script', async () => {
        const { fetchBlogPostBySlug, fetchRelatedPosts } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockResolvedValue(mockPost)
        fetchRelatedPosts.mockResolvedValue([])

        const { container } = render(
            await BlogPostPage({ params: Promise.resolve({ slug: 'test-blog-post' }) })
        )

        const structuredDataScripts = container.querySelectorAll('script[type="application/ld+json"]')
        expect(structuredDataScripts).toHaveLength(1)

        // Verify the script contains valid JSON
        const script = structuredDataScripts[0]
        const content = script.innerHTML
        expect(() => JSON.parse(content)).not.toThrow()
    })

    it('should call notFound when post is not found', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        const { notFound } = require('next/navigation')
        fetchBlogPostBySlug.mockResolvedValue(null)

        await BlogPostPage({ params: Promise.resolve({ slug: 'non-existent-post' }) })

        expect(notFound).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        const { notFound } = require('next/navigation')
        fetchBlogPostBySlug.mockRejectedValue(new Error('Database error'))

        await BlogPostPage({ params: Promise.resolve({ slug: 'test-blog-post' }) })

        expect(notFound).toHaveBeenCalled()
    })
})

describe('generateMetadata', () => {
    const mockPost = {
        id: '1',
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post excerpt',
        content: 'This is the full content of the test blog post',
        slug: 'test-blog-post',
        publishDate: '2024-01-01T00:00:00Z',
        coverImage: 'https://example.com/image.jpg',
        author: {
            name: 'Animesh Pandey',
            email: 'animesh@example.com',
        },
        tags: [
            { name: 'JavaScript' },
            { name: 'React' },
        ],
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should generate correct metadata for blog post', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockResolvedValue(mockPost)

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-blog-post' }) })

        expect(metadata.title).toBe(`${mockPost.title} | Animesh Pandey Blog`)
        expect(metadata.description).toBe(mockPost.excerpt)
        expect(metadata.alternates?.canonical).toBe(`https://animeshpandey.com/blog/${mockPost.slug}`)
        expect(metadata.openGraph?.type).toBe('article')
        expect(metadata.openGraph?.publishedTime).toBe(mockPost.publishDate)
    })

    it('should include blog post tags in keywords', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockResolvedValue(mockPost)

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-blog-post' }) })

        const keywords = metadata.keywords as string[]
        mockPost.tags.forEach(tag => {
            expect(keywords).toContain(tag.name)
        })
    })

    it('should return fallback metadata when post is not found', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockResolvedValue(null)

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'non-existent-post' }) })

        expect(metadata.title).toBe('Blog Post Not Found | Animesh Pandey')
        expect(metadata.description).toBe('The requested blog post could not be found.')
    })

    it('should handle errors gracefully', async () => {
        const { fetchBlogPostBySlug } = require('@/data/mockBlogData')
        fetchBlogPostBySlug.mockRejectedValue(new Error('Database error'))

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-blog-post' }) })

        expect(metadata.title).toBe('Blog Post | Animesh Pandey')
        expect(metadata.description).toBe('Blog post by Animesh Pandey')
    })
})

describe('generateStaticParams', () => {
    it('should generate static params for all blog posts', () => {
        const params = generateStaticParams()

        expect(params).toEqual([
            { slug: 'test-post-1' },
            { slug: 'test-post-2' },
            { slug: 'test-post-3' },
        ])
    })
})

describe('Blog Post SEO Functions', () => {
    const mockPost = {
        title: 'Test Blog Post',
        description: 'This is a test blog post description',
        slug: 'test-blog-post',
        publishedAt: '2024-01-01T00:00:00Z',
        tags: ['JavaScript', 'React'],
    }

    describe('generateBlogPostMetadata', () => {
        it('should generate correct blog post metadata', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.title).toBe(`${mockPost.title} | Animesh Pandey Blog`)
            expect(metadata.description).toBe(mockPost.description)
            expect(metadata.alternates?.canonical).toBe(`https://animeshpandey.com/blog/${mockPost.slug}`)
            expect(metadata.openGraph?.type).toBe('article')
            expect(metadata.openGraph?.publishedTime).toBe(mockPost.publishedAt)
        })

        it('should include tags in keywords', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            const keywords = metadata.keywords as string[]
            mockPost.tags.forEach(tag => {
                expect(keywords).toContain(tag)
            })
        })

        it('should have correct Twitter configuration', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.twitter?.card).toBe('summary_large_image')
            expect(metadata.twitter?.creator).toBe('@animeshpandey')
            expect(metadata.twitter?.title).toBe(mockPost.title)
            expect(metadata.twitter?.description).toBe(mockPost.description)
        })
    })

    describe('generateBlogPostStructuredData', () => {
        const mockStructuredDataPost = {
            title: 'Test Blog Post',
            description: 'This is a test blog post description',
            image: 'https://example.com/image.jpg',
            publishDate: '2024-01-01T00:00:00Z',
            author: 'Animesh Pandey',
            url: 'https://animeshpandey.com/blog/test-post',
            tags: ['JavaScript', 'React'],
            slug: 'test-post',
        }

        it('should generate correct blog post structured data', () => {
            const structuredData = generateBlogPostStructuredData(mockStructuredDataPost)

            expect(structuredData['@context']).toBe('https://schema.org')
            expect(structuredData['@type']).toBe('BlogPosting')
            expect(structuredData.headline).toBe(mockStructuredDataPost.title)
            expect(structuredData.datePublished).toBe(mockStructuredDataPost.publishDate)
            expect(structuredData.author.name).toBe(mockStructuredDataPost.author)
            expect(structuredData.url).toBe(mockStructuredDataPost.url)
            expect(structuredData.identifier).toBe(mockStructuredDataPost.slug)
        })

        it('should use default image when no image provided', () => {
            const postWithoutImage = { ...mockStructuredDataPost, image: undefined }
            const structuredData = generateBlogPostStructuredData(postWithoutImage)

            expect(structuredData.image).toBe('https://animeshpandey.com/opengraph-image.png')
        })

        it('should include tags in keywords', () => {
            const structuredData = generateBlogPostStructuredData(mockStructuredDataPost)

            expect(structuredData.keywords).toBe(mockStructuredDataPost.tags.join(', '))
        })

        it('should have correct article section', () => {
            const structuredData = generateBlogPostStructuredData(mockStructuredDataPost)

            expect(structuredData.articleSection).toBe('JavaScript')
        })

        it('should have correct word count', () => {
            const structuredData = generateBlogPostStructuredData(mockStructuredDataPost)

            expect(structuredData.wordCount).toBe(7) // "This is a test blog post description" = 7 words
        })
    })
})
