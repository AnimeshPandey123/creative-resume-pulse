#!/usr/bin/env tsx

import { blogPosts } from '../src/data/mockBlogData';
import { SITE_CONFIG } from '../src/config/seo';

// RSS Generator functions (extracted from route.ts for testing)
function generateRSSFeed(posts: typeof blogPosts) {
    const buildDate = new Date().toUTCString();
    const siteUrl = SITE_CONFIG.url;
    const feedUrl = `${siteUrl}/feed.xml`;

    const rssItems = posts.map(post => {
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
      <author><![CDATA[${SITE_CONFIG.author.name} <${SITE_CONFIG.author.email || 'animesh@animeshpandey.com'}>]]></author>
      <category><![CDATA[${categories}]]></category>
      ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('');

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
    <webMaster>${SITE_CONFIG.author.email || 'animesh@animeshpandey.com'} (${SITE_CONFIG.author.name})</webMaster>
    <managingEditor>${SITE_CONFIG.author.email || 'animesh@animeshpandey.com'} (${SITE_CONFIG.author.name})</managingEditor>
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

async function testRSSFeed() {
    try {
        console.log('🚀 Testing RSS Feed Generation...\n');

        // Get all blog posts sorted by publish date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        console.log(`📝 Found ${sortedPosts.length} blog posts:`);
        sortedPosts.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.title} (${post.publishDate})`);
        });

        // Generate RSS XML
        const rssXml = generateRSSFeed(sortedPosts);

        console.log('\n✅ RSS Feed generated successfully!');
        console.log(`📊 Feed contains ${sortedPosts.length} items`);
        console.log(`🔗 Feed URL: ${SITE_CONFIG.url}/feed.xml`);

        // Save to file for inspection
        const fs = await import('fs');
        const path = await import('path');

        const outputPath = path.join(process.cwd(), 'test-feed.xml');
        fs.writeFileSync(outputPath, rssXml);

        console.log(`💾 RSS feed saved to: ${outputPath}`);
        console.log('\n📋 RSS Feed Preview:');
        console.log('─'.repeat(50));
        console.log(rssXml.substring(0, 500) + '...');
        console.log('─'.repeat(50));

        // Validate XML structure
        const hasValidStructure = rssXml.includes('<?xml version="1.0"') &&
            rssXml.includes('<rss version="2.0"') &&
            rssXml.includes('<channel>') &&
            rssXml.includes('</rss>');

        if (hasValidStructure) {
            console.log('✅ RSS XML structure is valid');
        } else {
            console.log('❌ RSS XML structure is invalid');
        }

        console.log('\n🎉 RSS Feed test completed successfully!');

    } catch (error) {
        console.error('❌ Error testing RSS feed:', error);
        process.exit(1);
    }
}

// Run the test
testRSSFeed();
