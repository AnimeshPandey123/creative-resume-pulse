import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const BASE_URL = 'https://animeshpandey.com';

// Current date in ISO format
const currentDate = new Date().toISOString().split('T')[0];

// Load blog data
function loadBlogData() {
  try {
    const blogDataPath = path.join(__dirname, '../src/data/blog-posts.json');
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    return blogData;
  } catch (error) {
    console.error('❌ Error loading blog data:', error);
    return { posts: [] };
  }
}

// Generate main sitemap
function generateMainSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${BASE_URL}/opengraph-image.png</image:loc>
      <image:title>Animesh Pandey Portfolio</image:title>
    </image:image>
  </url>
  
  <!-- Blog -->
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About section -->
  <url>
    <loc>${BASE_URL}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Projects section -->
  <url>
    <loc>${BASE_URL}/#projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Experience section -->
  <url>
    <loc>${BASE_URL}/#experience</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Skills section -->
  <url>
    <loc>${BASE_URL}/#skills</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Contact section -->
  <url>
    <loc>${BASE_URL}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('✅ Main sitemap generated successfully');
}

// Generate blog sitemap with actual blog posts
function generateBlogSitemap() {
  const blogData = loadBlogData();
  const { posts } = blogData;

  let blogEntries = '';

  // Generate entries for each blog post
  posts.forEach(post => {
    const postDate = post.publishDate || currentDate;
    blogEntries += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

    // Add image if coverImage exists
    if (post.coverImage) {
      blogEntries += `
    <image:image>
      <image:loc>${post.coverImage}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>`;
    }

    blogEntries += `
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${blogEntries}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap-blog.xml'), sitemap);
  console.log(
    `✅ Blog sitemap generated successfully with ${posts.length} posts`
  );
}

// Generate sitemap index
function generateSitemapIndex() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap-index.xml'),
    sitemapIndex
  );
  console.log('✅ Sitemap index generated successfully');
}

// Main execution
function main() {
  try {
    console.log('🚀 Generating sitemaps for Next.js...');
    generateMainSitemap();
    generateBlogSitemap();
    generateSitemapIndex();
    console.log('✅ All sitemaps generated successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateMainSitemap, generateBlogSitemap, generateSitemapIndex, main };
