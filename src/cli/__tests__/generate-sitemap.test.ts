import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';

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
	const mjsPath = path.join(repoRoot, 'scripts', 'generate-sitemap.mjs');
	if (fs.existsSync(mjsPath)) {
		execFileSync(process.execPath, [mjsPath], { stdio: 'inherit' });
		return;
	}
	const cjsPath = path.join(repoRoot, 'scripts-dist', 'generate-sitemap.cjs');
	if (fs.existsSync(cjsPath)) {
		execFileSync(process.execPath, [cjsPath], { stdio: 'inherit' });
		return;
	}
	// Fallback for local dev: run ESM variant via node eval with ESM input type
	const cliPath = path.join(repoRoot, 'scripts', 'generate-sitemap.js');
	const moduleUrl = pathToFileURL(cliPath).href;
	const evalScript = `import(${JSON.stringify(moduleUrl)}).then(m => m.main && m.main());`;
	execFileSync(process.execPath, ['--input-type=module', '-e', evalScript], { stdio: 'inherit' });
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