import { BLOG_CONFIG } from '../seo';

describe('RSS Feed Configuration', () => {
  describe('BLOG_CONFIG', () => {
    it('should include RSS feed URL', () => {
      expect(BLOG_CONFIG).toHaveProperty('rssFeedUrl');
      expect(BLOG_CONFIG.rssFeedUrl).toBe('https://animeshpandey.com/feed.xml');
    });

    it('should have correct RSS feed URL format', () => {
      expect(BLOG_CONFIG.rssFeedUrl).toMatch(
        /^https:\/\/animeshpandey\.com\/feed\.xml$/
      );
    });
  });
});
