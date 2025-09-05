import { GET } from '../route';
import { NextResponse } from 'next/server';

// Mock the blog data
jest.mock('@/data/mockBlogData', () => ({
  blogPosts: [
    {
      id: '1',
      title: 'Test Blog Post 1',
      excerpt: 'This is a test blog post excerpt',
      slug: 'test-blog-post-1',
      publishDate: '2024-01-01T00:00:00Z',
      coverImage: 'https://example.com/image1.jpg',
      author: {
        name: 'Animesh Pandey',
        email: 'animesh@example.com',
      },
      tags: [{ name: 'JavaScript' }, { name: 'React' }],
    },
    {
      id: '2',
      title: 'Test Blog Post 2',
      excerpt: 'This is another test blog post excerpt',
      slug: 'test-blog-post-2',
      publishDate: '2024-01-02T00:00:00Z',
      coverImage: null,
      author: {
        name: 'Animesh Pandey',
        email: 'animesh@example.com',
      },
      tags: [{ name: 'Python' }, { name: 'Django' }],
    },
  ],
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: jest.fn(),
}));

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('RSS Feed Route - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NextResponse as unknown as jest.Mock).mockReturnValue({
      headers: {},
    });
  });

  it('should return RSS feed with correct headers', async () => {
    await GET();

    expect(NextResponse).toHaveBeenCalledWith(
      expect.stringContaining('<?xml version="1.0" encoding="UTF-8"?>'),
      {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );
  });

  it('should generate valid RSS XML structure', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for RSS XML declaration
    expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rssXml).toContain('<rss version="2.0"');

    // Check for channel information
    expect(rssXml).toContain('<channel>');
    expect(rssXml).toContain('<title><![CDATA[Animesh Pandey Blog]]></title>');
    expect(rssXml).toContain('<link>https://animeshpandey.com/blog</link>');
    expect(rssXml).toContain('<language>en-US</language>');
  });

  it('should include all blog posts as RSS items', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for blog post items
    expect(rssXml).toContain('<item>');
    expect(rssXml).toContain('<title><![CDATA[Test Blog Post 1]]></title>');
    expect(rssXml).toContain('<title><![CDATA[Test Blog Post 2]]></title>');
    expect(rssXml).toContain(
      '<link>https://animeshpandey.com/blog/test-blog-post-1</link>'
    );
    expect(rssXml).toContain(
      '<link>https://animeshpandey.com/blog/test-blog-post-2</link>'
    );
  });

  it('should sort posts by publish date (newest first)', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Find the positions of the titles in the XML
    const title1Index = rssXml.indexOf(
      '<title><![CDATA[Test Blog Post 1]]></title>'
    );
    const title2Index = rssXml.indexOf(
      '<title><![CDATA[Test Blog Post 2]]></title>'
    );

    // Post 2 (newer date: 2024-01-02) should come before Post 1 (older date: 2024-01-01)
    expect(title2Index).toBeLessThan(title1Index);
  });

  it('should include proper metadata for each post', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for descriptions
    expect(rssXml).toContain(
      '<description><![CDATA[This is a test blog post excerpt]]></description>'
    );
    expect(rssXml).toContain(
      '<description><![CDATA[This is another test blog post excerpt]]></description>'
    );

    // Check for publication dates
    expect(rssXml).toContain(
      '<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>'
    );
    expect(rssXml).toContain(
      '<pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>'
    );

    // Check for authors
    expect(rssXml).toContain(
      '<author><![CDATA[Animesh Pandey <animeshpandey.pro@gmail.com>]]></author>'
    );

    // Check for categories
    expect(rssXml).toContain(
      '<category><![CDATA[JavaScript, React]]></category>'
    );
    expect(rssXml).toContain('<category><![CDATA[Python, Django]]></category>');
  });

  it('should include image enclosures when available', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for image enclosure for post with cover image
    expect(rssXml).toContain(
      '<enclosure url="https://example.com/image1.jpg" type="image/jpeg" />'
    );

    // Should only have one enclosure (for the post with cover image)
    const enclosureMatches = rssXml.match(/<enclosure/g);
    expect(enclosureMatches).toHaveLength(1);
  });

  it('should include feed metadata', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for feed metadata
    expect(rssXml).toContain('<generator>Next.js RSS Generator</generator>');
    expect(rssXml).toContain(
      '<webMaster>animeshpandey.pro@gmail.com (Animesh Pandey)</webMaster>'
    );
    expect(rssXml).toContain(
      '<managingEditor>animeshpandey.pro@gmail.com (Animesh Pandey)</managingEditor>'
    );
    expect(rssXml).toContain(
      '<copyright>Copyright 2025 Animesh Pandey</copyright>'
    );
    expect(rssXml).toContain('<ttl>60</ttl>');
  });

  it('should include feed image', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for feed image
    expect(rssXml).toContain('<image>');
    expect(rssXml).toContain(
      '<url>https://d1iukwsziul56d.cloudfront.net/drupal-local/s3fs-public/2025-08/IMG_3793%202.JPG</url>'
    );
    expect(rssXml).toContain('<title><![CDATA[Animesh Pandey Blog]]></title>');
    expect(rssXml).toContain('<link>https://animeshpandey.com/blog</link>');
    expect(rssXml).toContain('<width>144</width>');
    expect(rssXml).toContain('<height>144</height>');
  });

  it('should include atom self-link', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for atom self-link
    expect(rssXml).toContain(
      '<atom:link href="https://animeshpandey.com/feed.xml" rel="self" type="application/rss+xml" />'
    );
  });

  it('should include proper RSS namespaces', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check for RSS namespaces
    expect(rssXml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(rssXml).toContain(
      'xmlns:content="http://purl.org/rss/1.0/modules/content/"'
    );
  });

  it('should include build date and publication date', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Extract build date from XML
    const buildDateMatch = rssXml.match(
      /<lastBuildDate>(.*?)<\/lastBuildDate>/
    );
    const pubDateMatch = rssXml.match(/<pubDate>(.*?)<\/pubDate>/);

    expect(buildDateMatch).toBeTruthy();
    expect(pubDateMatch).toBeTruthy();

    if (buildDateMatch && pubDateMatch) {
      const buildDate = new Date(buildDateMatch[1]);
      const pubDate = new Date(pubDateMatch[1]);

      // Both dates should be valid dates
      expect(buildDate.getTime()).not.toBeNaN();
      expect(pubDate.getTime()).not.toBeNaN();

      // Both dates should be recent (within the last minute)
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      expect(buildDate.getTime()).toBeGreaterThan(oneMinuteAgo.getTime());
      expect(pubDate.getTime()).toBeGreaterThan(oneMinuteAgo.getTime());
    }
  });

  it('should escape XML special characters in content', async () => {
    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Check that the RSS XML doesn't contain unescaped special characters
    expect(rssXml).not.toContain('<![CDATA[&]]>');
    expect(rssXml).not.toContain('<![CDATA[<]]>');
    expect(rssXml).not.toContain('<![CDATA[>]]>');
    expect(rssXml).not.toContain('<![CDATA["]]>');
    expect(rssXml).not.toContain("<![CDATA[']]>");
  });

  it('should handle empty blog posts array gracefully', async () => {
    // Mock empty blog posts by temporarily replacing the mock
    const { blogPosts } = require('@/data/mockBlogData');
    const originalLength = blogPosts.length;
    blogPosts.length = 0;

    await GET();

    const rssXml = (NextResponse as unknown as jest.Mock).mock.calls[0][0];

    // Should still generate valid RSS structure
    expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rssXml).toContain('<rss version="2.0"');
    expect(rssXml).toContain('<channel>');

    // Should not contain any items
    expect(rssXml).not.toContain('<item>');

    // Restore original length
    blogPosts.length = originalLength;
  });

  it('should handle errors gracefully', async () => {
    // Mock an error by making blogPosts throw
    const { blogPosts } = require('@/data/mockBlogData');
    const originalSort = blogPosts.sort;
    blogPosts.sort = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    const mockErrorResponse = {
      status: 500,
    };
    (NextResponse as unknown as jest.Mock).mockReturnValue(mockErrorResponse);

    await GET();

    expect(NextResponse).toHaveBeenCalledWith('Error generating RSS feed', {
      status: 500,
    });
    expect(console.error).toHaveBeenCalledWith(
      'Error generating RSS feed:',
      expect.any(Error)
    );

    // Restore original sort function
    blogPosts.sort = originalSort;
  });
});
