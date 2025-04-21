// generate-sitemap.ts
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { Readable } from 'stream';

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/blog', changefreq: 'daily', priority: 0.7 },
];

const hostname = 'https://animeshpandey.com';

async function generateSitemap() {
  try {
    const sitemapStream = new SitemapStream({ hostname });
    const xml = await streamToPromise(Readable.from(links).pipe(sitemapStream)).then((data) => data.toString());

    const outputPath = resolve('public', 'sitemap.xml');
    const writeStream = createWriteStream(outputPath);
    writeStream.write(xml);
    writeStream.end();

    console.log('✅ Sitemap generated at', outputPath);
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err);
  }
}

generateSitemap();
