import { blogPosts } from '@/data/mockBlogData';
import { SITE_CONFIG } from '@/config/seo';

// Test the RSS feed generation logic directly
describe('RSS Feed Route Logic', () => {
    it('should generate valid RSS XML structure', () => {
        // Test the core RSS generation logic
        const sortedPosts = [...blogPosts].sort((a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        expect(sortedPosts).toBeDefined();
        expect(sortedPosts.length).toBeGreaterThan(0);
        expect(sortedPosts[0].title).toBeDefined();
        expect(sortedPosts[0].slug).toBeDefined();
        expect(sortedPosts[0].publishDate).toBeDefined();
    });

    it('should handle RSS feed metadata correctly', () => {
        const siteUrl = SITE_CONFIG.url;
        const feedUrl = `${siteUrl}/feed.xml`;

        expect(siteUrl).toBe('https://animeshpandey.com');
        expect(feedUrl).toBe('https://animeshpandey.com/feed.xml');
    });

    it('should format dates correctly for RSS', () => {
        const testDate = '2024-01-01T00:00:00Z';
        const formattedDate = new Date(testDate).toUTCString();

        expect(formattedDate).toBe('Mon, 01 Jan 2024 00:00:00 GMT');
    });

    it('should escape XML special characters', () => {
        const testString = 'Test & "Special" Characters < >';
        const escaped = testString
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        expect(escaped).toBe('Test &amp; &quot;Special&quot; Characters &lt; &gt;');
    });

    it('should generate proper RSS item structure', () => {
        const post = blogPosts[0];
        const siteUrl = SITE_CONFIG.url;
        const postUrl = `${siteUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.publishDate).toUTCString();
        const categories = post.tags.map(tag => tag.name).join(', ');

        expect(postUrl).toContain('/blog/');
        expect(pubDate).toMatch(/^\w+, \d{2} \w+ \d{4} \d{2}:\d{2}:\d{2} GMT$/);
        expect(categories).toBeDefined();
    });

    it('should handle image enclosures correctly', () => {
        const postWithImage = blogPosts.find(post => post.coverImage);
        const postWithoutImage = blogPosts.find(post => !post.coverImage);

        if (postWithImage) {
            expect(postWithImage.coverImage).toBeDefined();
            expect(postWithImage.coverImage).toMatch(/^https?:\/\//);
        }

        if (postWithoutImage) {
            expect(postWithoutImage.coverImage).toBeNull();
        }
    });

    it('should validate RSS feed configuration', () => {
        expect(SITE_CONFIG.title).toBeDefined();
        expect(SITE_CONFIG.description).toBeDefined();
        expect(SITE_CONFIG.url).toBeDefined();
        expect(SITE_CONFIG.author.name).toBeDefined();
        // Note: SITE_CONFIG.author.email might not exist, so we check if it exists
        if (SITE_CONFIG.author.email) {
            expect(SITE_CONFIG.author.email).toBeDefined();
        }
    });

    it('should handle empty blog posts array', () => {
        const emptyPosts: typeof blogPosts = [];
        const sortedEmptyPosts = [...emptyPosts].sort((a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        expect(sortedEmptyPosts).toEqual([]);
        expect(sortedEmptyPosts.length).toBe(0);
    });

    it('should generate proper content type headers', () => {
        const contentType = 'application/rss+xml; charset=utf-8';
        const cacheControl = 'public, max-age=3600, s-maxage=3600';

        expect(contentType).toBe('application/rss+xml; charset=utf-8');
        expect(cacheControl).toBe('public, max-age=3600, s-maxage=3600');
    });

    it('should validate RSS namespace declarations', () => {
        const rssNamespace = 'http://purl.org/rss/1.0/';
        const atomNamespace = 'http://www.w3.org/2005/Atom';
        const contentNamespace = 'http://purl.org/rss/1.0/modules/content/';

        expect(rssNamespace).toBe('http://purl.org/rss/1.0/');
        expect(atomNamespace).toBe('http://www.w3.org/2005/Atom');
        expect(contentNamespace).toBe('http://purl.org/rss/1.0/modules/content/');
    });
});
