import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

function readPublicFile(file: string) {
	return fs.readFileSync(path.join(publicDir, file), 'utf-8');
}

describe('SEO public assets', () => {
	describe('robots.txt', () => {
		it('exists and includes allowed and sitemap directives', () => {
			const content = readPublicFile('robots.txt');
			expect(content).toContain('User-agent: *');
			expect(content).toContain('Allow: /');
			expect(content).toContain('Sitemap: https://animeshpandey.com/sitemap-index.xml');
			expect(content).toContain('Sitemap: https://animeshpandey.com/sitemap.xml');
			expect(content).toContain('Sitemap: https://animeshpandey.com/sitemap-blog.xml');
		});

		it('disallows internal and bad bots', () => {
			const content = readPublicFile('robots.txt');
			expect(content).toContain('Disallow: /api/');
			expect(content).toContain('Disallow: /_next/');
			expect(content).toContain('User-agent: AhrefsBot');
			expect(content).toContain('User-agent: SemrushBot');
		});
	});

	describe('sitemaps', () => {
		it('sitemap-index.xml lists main and blog sitemaps', () => {
			const xml = readPublicFile('sitemap-index.xml');
			expect(xml).toContain('<loc>https://animeshpandey.com/sitemap.xml</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/sitemap-blog.xml</loc>');
		});

		it('sitemap.xml includes homepage and anchors', () => {
			const xml = readPublicFile('sitemap.xml');
			expect(xml).toContain('<loc>https://animeshpandey.com/</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/blog</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/#about</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/#projects</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/#experience</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/#skills</loc>');
			expect(xml).toContain('<loc>https://animeshpandey.com/#contact</loc>');
		});

		it('sitemap-blog.xml includes known blog URLs', () => {
			const xml = readPublicFile('sitemap-blog.xml');
			expect(xml).toContain('<urlset');
			expect(xml).toContain('<loc>https://animeshpandey.com/blog/');
		});
	});

	describe('manifest and icons', () => {
		it('site.webmanifest contains required fields and icons', () => {
			const manifestRaw = readPublicFile('site.webmanifest');
			const manifest = JSON.parse(manifestRaw);
			expect(manifest.name).toBeDefined();
			expect(manifest.short_name).toBeDefined();
			expect(manifest.start_url).toBe('/');
			expect(manifest.display).toBeDefined();
			expect(Array.isArray(manifest.icons)).toBe(true);
			expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
			manifest.icons.forEach((icon: any) => {
				expect(fs.existsSync(path.join(publicDir, icon.src))).toBe(true);
			});
		});

		it('favicons and OpenGraph image exist', () => {
			const files = [
				'favicon.ico',
				'favicon-16x16.png',
				'favicon-32x32.png',
				'apple-touch-icon.png',
				'android-chrome-192x192.png',
				'android-chrome-512x512.png',
				'opengraph-image.png',
			];
			files.forEach((f) => {
				expect(fs.existsSync(path.join(publicDir, f))).toBe(true);
			});
		});
	});
});