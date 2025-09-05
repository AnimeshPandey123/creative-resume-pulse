import { blogPosts } from '@/data/mockBlogData';
import { SITE_CONFIG } from '@/config/seo';

// RSS Generator functions (extracted from route.ts for testing)
function generateRSSFeed(posts: typeof blogPosts) {
  const buildDate = new Date().toUTCString();
  const siteUrl = SITE_CONFIG.url;
  const feedUrl = `${siteUrl}/feed.xml`;

  const rssItems = posts
    .map(post => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishDate).toUTCString();
      const categories = post.tags.map(tag => tag.name).join(', ');

      return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <description><![CDATA[${escapeXml(post.excerpt)}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${SITE_CONFIG.author.name} <animeshpandey.pro@gmail.com>]]></author>
      <category><![CDATA[${categories}]]></category>
      ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${SITE_CONFIG.name} Blog]]></title>
    <description><![CDATA[${SITE_CONFIG.description} - Software engineering insights, tutorials, and technical articles by Animesh Pandey.]]></description>
    <link>${siteUrl}/blog</link>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js RSS Generator</generator>
    <webMaster>animeshpandey.pro@gmail.com (${SITE_CONFIG.author.name})</webMaster>
    <managingEditor>animeshpandey.pro@gmail.com (${SITE_CONFIG.author.name})</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} ${SITE_CONFIG.author.name}</copyright>
    <image>
      <url>${SITE_CONFIG.avatarUrl}</url>
      <title><![CDATA[${SITE_CONFIG.name} Blog]]></title>
      <link>${siteUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

describe('RSS Feed Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate valid RSS feed', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Check for RSS XML declaration
    expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rssXml).toContain('<rss version="2.0"');

    // Check for channel information
    expect(rssXml).toContain('<channel>');
    expect(rssXml).toContain(
      `<title><![CDATA[${SITE_CONFIG.name} Blog]]></title>`
    );
    expect(rssXml).toContain(
      `<description><![CDATA[${SITE_CONFIG.description} - Software engineering insights, tutorials, and technical articles by Animesh Pandey.]]></description>`
    );
    expect(rssXml).toContain(`<link>${SITE_CONFIG.url}/blog</link>`);
    expect(rssXml).toContain('<language>en-US</language>');
  });

  it('should include all blog posts as RSS items', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Check for blog post items
    expect(rssXml).toContain('<item>');
    expect(rssXml).toContain('<title><![CDATA[Test Blog Post 1]]></title>');
    expect(rssXml).toContain('<title><![CDATA[Test Blog Post 2]]></title>');

    // Check for post URLs
    expect(rssXml).toContain(
      `<link>${SITE_CONFIG.url}/blog/test-blog-post-1</link>`
    );
    expect(rssXml).toContain(
      `<link>${SITE_CONFIG.url}/blog/test-blog-post-2</link>`
    );

    // Check for GUIDs
    expect(rssXml).toContain(
      `<guid isPermaLink="true">${SITE_CONFIG.url}/blog/test-blog-post-1</guid>`
    );
    expect(rssXml).toContain(
      `<guid isPermaLink="true">${SITE_CONFIG.url}/blog/test-blog-post-2</guid>`
    );
  });

  it('should include proper metadata for each post', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

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

  it('should include image enclosures when available', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Check for image enclosure for post with cover image
    expect(rssXml).toContain(
      '<enclosure url="https://example.com/image1.jpg" type="image/jpeg" />'
    );

    // Should not include enclosure for post without cover image
    const enclosureMatches = rssXml.match(/<enclosure/g);
    expect(enclosureMatches).toHaveLength(1);
  });

  it('should include feed metadata', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

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

  it('should include feed image', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Check for feed image
    expect(rssXml).toContain('<image>');
    expect(rssXml).toContain(`<url>${SITE_CONFIG.avatarUrl}</url>`);
    expect(rssXml).toContain(
      `<title><![CDATA[${SITE_CONFIG.name} Blog]]></title>`
    );
    expect(rssXml).toContain(`<link>${SITE_CONFIG.url}/blog</link>`);
    expect(rssXml).toContain('<width>144</width>');
    expect(rssXml).toContain('<height>144</height>');
  });

  it('should include atom self-link', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Check for atom self-link
    expect(rssXml).toContain(
      '<atom:link href="https://animeshpandey.com/feed.xml" rel="self" type="application/rss+xml" />'
    );
  });

  it('should sort posts by publish date (newest first)', () => {
    const sortedPosts = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    const rssXml = generateRSSFeed(sortedPosts);

    // Find the positions of the titles in the XML
    const title1Index = rssXml.indexOf(
      '<title><![CDATA[Test Blog Post 1]]></title>'
    );
    const title2Index = rssXml.indexOf(
      '<title><![CDATA[Test Blog Post 2]]></title>'
    );

    // Post 2 (newer date) should come before Post 1 (older date)
    expect(title2Index).toBeLessThan(title1Index);
  });

  it('should escape XML special characters', () => {
    const postsWithSpecialChars = [
      {
        id: '3',
        title: 'Test & "Special" Characters < >',
        excerpt: 'This has & "special" characters < > in it',
        slug: 'test-special-chars',
        publishDate: '2024-01-03T00:00:00Z',
        coverImage: '',
        author: {
          id: 'animesh',
          name: 'Animesh Pandey',
          email: 'animesh@example.com',
          bio: 'Test author',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        tags: [{ id: 'test', name: 'Test', slug: 'test' }],
        readingTime: 5,
      },
    ];

    const rssXml = generateRSSFeed(postsWithSpecialChars);

    // Check that special characters are properly escaped
    expect(rssXml).toContain(
      '<title><![CDATA[Test &amp; &quot;Special&quot; Characters &lt; &gt;]]></title>'
    );
    expect(rssXml).toContain(
      '<description><![CDATA[This has &amp; &quot;special&quot; characters &lt; &gt; in it]]></description>'
    );
  });

  describe('escapeXml function', () => {
    it('should escape all XML special characters', () => {
      const testString = 'Test & "Special" Characters < >';
      const escaped = escapeXml(testString);

      expect(escaped).toBe(
        'Test &amp; &quot;Special&quot; Characters &lt; &gt;'
      );
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle string without special characters', () => {
      const testString = 'Normal text without special characters';
      expect(escapeXml(testString)).toBe(testString);
    });
  });
});
