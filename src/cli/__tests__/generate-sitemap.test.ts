import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, 'public');

const files = {
	sitemap: path.join(publicDir, 'sitemap.xml'),
	sitemapBlog: path.join(publicDir, 'sitemap-blog.xml'),
	sitemapIndex: path.join(publicDir, 'sitemap-index.xml'),
};

type Backup = { filepath: string; exists: boolean; content?: string };

function backupFile(filepath: string): Backup {
	if (fs.existsSync(filepath)) {
		return { filepath, exists: true, content: fs.readFileSync(filepath, 'utf-8') };
	}
	return { filepath, exists: false };
}

function restoreFile(backup: Backup) {
	if (backup.exists) {
		fs.writeFileSync(backup.filepath, backup.content || '', 'utf-8');
	} else if (fs.existsSync(backup.filepath)) {
		fs.unlinkSync(backup.filepath);
	}
}

function runCli() {
	const cliPath = path.join(repoRoot, 'scripts', 'generate-sitemap.js');
	execFileSync(process.execPath, [cliPath], { stdio: 'inherit' });
}

describe('Sitemap CLI (scripts/generate-sitemap.js)', () => {
	let backups: Backup[] = [];

	beforeAll(() => {
		backups = [backupFile(files.sitemap), backupFile(files.sitemapBlog), backupFile(files.sitemapIndex)];
		runCli();
	});

	afterAll(() => {
		backups.forEach(restoreFile);
	});

	it('generates main sitemap.xml, blog sitemap and index', () => {
		expect(fs.existsSync(files.sitemap)).toBe(true);
		expect(fs.existsSync(files.sitemapBlog)).toBe(true);
		expect(fs.existsSync(files.sitemapIndex)).toBe(true);
	});

	it('writes valid XML with expected URLs', () => {
		const xml = fs.readFileSync(files.sitemap, 'utf-8');
		expect(xml.startsWith('<?xml')).toBe(true);
		expect(xml).toContain('<loc>https://animeshpandey.com/</loc>');
		expect(xml).toContain('<loc>https://animeshpandey.com/blog</loc>');
	});

	it('includes blog post URLs in sitemap-blog.xml when data exists', () => {
		const xml = fs.readFileSync(files.sitemapBlog, 'utf-8');
		expect(xml.startsWith('<?xml')).toBe(true);
		// Should contain at least one blog URL entry
		expect(xml).toContain('<loc>https://animeshpandey.com/blog/');
	});
});