"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// generate-sitemap.ts
const sitemap_1 = require("sitemap");
const fs_1 = require("fs");
const path_1 = require("path");
const stream_1 = require("stream");
const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/blog', changefreq: 'daily', priority: 0.7 },
];
const hostname = 'https://animeshpandey.com';
async function generateSitemap() {
    try {
        const sitemapStream = new sitemap_1.SitemapStream({ hostname });
        const xml = await (0, sitemap_1.streamToPromise)(stream_1.Readable.from(links).pipe(sitemapStream)).then((data) => data.toString());
        const outputPath = (0, path_1.resolve)('public', 'sitemap.xml');
        const writeStream = (0, fs_1.createWriteStream)(outputPath);
        writeStream.write(xml);
        writeStream.end();
        console.log('✅ Sitemap generated at', outputPath);
    }
    catch (err) {
        console.error('❌ Failed to generate sitemap:', err);
    }
}
generateSitemap();
