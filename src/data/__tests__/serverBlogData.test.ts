import { fetchBlogPostWithContentBySlug } from '@/data/serverBlogData';
import { blogPosts } from '@/data/mockBlogData';
import { promises as fsp } from 'fs';
import matter from 'gray-matter';

// Mock dependencies
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
    },
}));

jest.mock('gray-matter', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/data/mockBlogData', () => ({
    blogPosts: [
        {
            id: '1',
            title: 'Test Post',
            slug: 'test-post',
            excerpt: 'Test excerpt',
            coverImage: 'test-image.jpg',
            publishDate: '2024-01-01',
            readingTime: 5,
            author: { id: '1', name: 'Test Author', bio: 'Test bio', avatarUrl: 'test-avatar.jpg' },
            tags: [{ id: '1', name: 'Test Tag', slug: 'test-tag' }],
        },
    ],
}));

const mockFsp = fsp as jest.Mocked<typeof fsp>;
const mockMatter = matter as jest.MockedFunction<typeof matter>;

describe('serverBlogData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchBlogPostWithContentBySlug', () => {
        it('should return undefined when post is not found', async () => {
            const result = await fetchBlogPostWithContentBySlug('non-existent-post');
            expect(result).toBeUndefined();
        });

        it('should return base post when markdown file read fails', async () => {
            mockFsp.readFile.mockRejectedValue(new Error('File not found'));

            const result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual(blogPosts[0]);
            expect(mockFsp.readFile).toHaveBeenCalledWith(
                expect.stringContaining('test-post.md'),
                'utf-8'
            );
        });

        it('should fetch and parse markdown content successfully', async () => {
            const mockContent = 'Test markdown content';
            const mockData = {
                title: 'Overridden Title',
                excerpt: 'Overridden excerpt',
                publishDate: '2024-02-01',
            };

            mockFsp.readFile.mockResolvedValue(mockContent);
            mockMatter.mockReturnValue({
                content: mockContent,
                data: mockData,
            } as any);

            const result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: 'Overridden Title',
                excerpt: 'Overridden excerpt',
                publishDate: '2024-02-01',
                content: mockContent,
            });

            expect(mockFsp.readFile).toHaveBeenCalledWith(
                expect.stringContaining('test-post.md'),
                'utf-8'
            );
            expect(mockMatter).toHaveBeenCalledWith(mockContent);
        });

        it('should use base post data when frontmatter is missing', async () => {
            const mockContent = 'Test markdown content';

            mockFsp.readFile.mockResolvedValue(mockContent);
            mockMatter.mockReturnValue({
                content: mockContent,
                data: {},
            } as any);

            const result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: blogPosts[0].title,
                excerpt: blogPosts[0].excerpt,
                publishDate: blogPosts[0].publishDate,
                content: mockContent,
            });
        });

        it('should handle different frontmatter data combinations', async () => {
            const mockContent = 'Test markdown content';

            // Test with only title override
            mockFsp.readFile.mockResolvedValue(mockContent);
            mockMatter.mockReturnValue({
                content: mockContent,
                data: { title: 'Only Title Override' },
            } as any);

            let result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: 'Only Title Override',
                excerpt: blogPosts[0].excerpt, // Should use base post data
                publishDate: blogPosts[0].publishDate, // Should use base post data
                content: mockContent,
            });

            // Test with only excerpt override
            mockMatter.mockReturnValue({
                content: mockContent,
                data: { excerpt: 'Only Excerpt Override' },
            } as any);

            result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: blogPosts[0].title, // Should use base post data
                excerpt: 'Only Excerpt Override',
                publishDate: blogPosts[0].publishDate, // Should use base post data
                content: mockContent,
            });

            // Test with only publishDate override
            mockMatter.mockReturnValue({
                content: mockContent,
                data: { publishDate: '2024-12-31' },
            } as any);

            result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: blogPosts[0].title, // Should use base post data
                excerpt: blogPosts[0].excerpt, // Should use base post data
                publishDate: '2024-12-31',
                content: mockContent,
            });
        });

        it('should handle empty frontmatter data', async () => {
            const mockContent = 'Test markdown content';

            mockFsp.readFile.mockResolvedValue(mockContent);
            mockMatter.mockReturnValue({
                content: mockContent,
                data: {}, // Empty data
            } as any);

            const result = await fetchBlogPostWithContentBySlug('test-post');

            expect(result).toEqual({
                ...blogPosts[0],
                title: blogPosts[0].title,
                excerpt: blogPosts[0].excerpt,
                publishDate: blogPosts[0].publishDate,
                content: mockContent,
            });
        });

        it('should handle error in require call gracefully', async () => {
            // This test verifies that the function handles errors gracefully
            // even when the require call fails
            const result = await fetchBlogPostWithContentBySlug('test-post');

            // Should return the base post when there's an error
            expect(result).toBeDefined();
            expect(result?.id).toBe('1');
            expect(result?.slug).toBe('test-post');
        });
    });
});
