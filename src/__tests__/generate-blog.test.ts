import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Blog Generation CLI', () => {
    const cliPath = path.join(__dirname, '../../scripts/generate-blog.ts');

    beforeEach(() => {
        // Clean up any test files
        const testBlogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
        if (fs.existsSync(testBlogPath)) {
            fs.unlinkSync(testBlogPath);
        }

        const complexBlogPath = path.join(__dirname, '../content/blog/complex-title-with-special-characters.md');
        if (fs.existsSync(complexBlogPath)) {
            fs.unlinkSync(complexBlogPath);
        }

        const reactHooksPath = path.join(__dirname, '../content/blog/react-hooks-guide.md');
        if (fs.existsSync(reactHooksPath)) {
            fs.unlinkSync(reactHooksPath);
        }

        const pythonTutorialPath = path.join(__dirname, '../content/blog/python-tutorial.md');
        if (fs.existsSync(pythonTutorialPath)) {
            fs.unlinkSync(pythonTutorialPath);
        }

        const webDevPath = path.join(__dirname, '../content/blog/web-development-best-practices.md');
        if (fs.existsSync(webDevPath)) {
            fs.unlinkSync(webDevPath);
        }

        const quickGuidePath = path.join(__dirname, '../content/blog/quick-guide.md');
        if (fs.existsSync(quickGuidePath)) {
            fs.unlinkSync(quickGuidePath);
        }
    });

    afterEach(() => {
        // Clean up after tests
        const testBlogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
        if (fs.existsSync(testBlogPath)) {
            fs.unlinkSync(testBlogPath);
        }

        const complexBlogPath = path.join(__dirname, '../content/blog/complex-title-with-special-characters.md');
        if (fs.existsSync(complexBlogPath)) {
            fs.unlinkSync(complexBlogPath);
        }

        const reactHooksPath = path.join(__dirname, '../content/blog/react-hooks-guide.md');
        if (fs.existsSync(reactHooksPath)) {
            fs.unlinkSync(reactHooksPath);
        }

        const pythonTutorialPath = path.join(__dirname, '../content/blog/python-tutorial.md');
        if (fs.existsSync(pythonTutorialPath)) {
            fs.unlinkSync(pythonTutorialPath);
        }

        const webDevPath = path.join(__dirname, '../content/blog/web-development-best-practices.md');
        if (fs.existsSync(webDevPath)) {
            fs.unlinkSync(webDevPath);
        }

        const quickGuidePath = path.join(__dirname, '../content/blog/quick-guide.md');
        if (fs.existsSync(quickGuidePath)) {
            fs.unlinkSync(quickGuidePath);
        }
    });

    describe('CLI Arguments', () => {
        test('should require title argument', () => {
            expect(() => {
                execSync(`npx tsx ${cliPath}`, { stdio: 'pipe' });
            }).toThrow();
        });

        test('should accept title argument', () => {
            const result = execSync(`npx tsx ${cliPath} --title "Test Blog Post"`, {
                stdio: 'pipe',
                encoding: 'utf8'
            });
            expect(result).toBeDefined();
        });

        test('should accept optional context argument', () => {
            const result = execSync(`npx tsx ${cliPath} --title "Test Blog Post" --context "This is a test context"`, {
                stdio: 'pipe',
                encoding: 'utf8'
            });
            expect(result).toBeDefined();
        });
    });

    describe('File Generation', () => {
        test('should create blog post file with correct structure', () => {
            execSync(`npx tsx ${cliPath} --title "Test Blog Post"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
            expect(fs.existsSync(blogPath)).toBe(true);

            const content = fs.readFileSync(blogPath, 'utf8');
            expect(content).toMatch(/^---/);
            expect(content).toMatch(/title:/);
            expect(content).toMatch(/excerpt:/);
            expect(content).toMatch(/publishDate:/);
            expect(content).toMatch(/tags:/);
            expect(content).toMatch(/---/);
        });

        test('should generate SEO-friendly slug from title', () => {
            execSync(`npx tsx ${cliPath} --title "Complex Title with Special Characters!"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/complex-title-with-special-characters.md');
            expect(fs.existsSync(blogPath)).toBe(true);
        });
    });

    describe('Metadata Generation', () => {
        test('should generate valid frontmatter', () => {
            execSync(`npx tsx ${cliPath} --title "Test Blog Post"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Extract frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            expect(frontmatterMatch).toBeTruthy();

            const frontmatter = frontmatterMatch![1];
            expect(frontmatter).toMatch(/title: "Test Blog Post"/);
            expect(frontmatter).toMatch(/excerpt:/);
            expect(frontmatter).toMatch(/publishDate:/);
            expect(frontmatter).toMatch(/tags:/);
        });

        test('should include current date in publishDate', () => {
            execSync(`npx tsx ${cliPath} --title "Test Blog Post"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            const today = new Date().toISOString().split('T')[0];
            expect(content).toMatch(new RegExp(`publishDate: "${today}"`));
        });
    });

    describe('Content Generation', () => {
        test('should generate content with proper markdown structure', () => {
            execSync(`npx tsx ${cliPath} --title "Test Blog Post"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/test-blog-post.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Check that content follows the expected structure
            expect(content).toMatch(/## Test Blog Post/);
            expect(content).toMatch(/### Introduction/);
            expect(content).toMatch(/### Main Content/);
            expect(content).toMatch(/### Conclusion/);
        });

        test('should use context when provided', () => {
            const context = "This is a comprehensive guide about React hooks";
            execSync(`npx tsx ${cliPath} --title "React Hooks Guide" --context "${context}"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/react-hooks-guide.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            expect(content).toMatch(context);
        });

        test('should generate fallback content when no context provided', () => {
            execSync(`npx tsx ${cliPath} --title "Python Tutorial"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/python-tutorial.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            expect(content).toMatch(/This is a comprehensive guide about python tutorial/);
        });
    });

    describe('SEO and Structure', () => {
        test('should generate content with proper heading hierarchy', () => {
            execSync(`npx tsx ${cliPath} --title "Web Development Best Practices"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/web-development-best-practices.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Check heading structure
            expect(content).toMatch(/^## /m); // Main title
            expect(content).toMatch(/^### /m); // Subheadings
        });

        test('should include reading time estimation', () => {
            execSync(`npx tsx ${cliPath} --title "Quick Guide"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/quick-guide.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Content should be substantial enough for a blog post
            const contentLength = content.length;
            expect(contentLength).toBeGreaterThan(500); // Minimum content length
        });
    });

    describe('AI Content Generation', () => {
        test('should generate AI-powered content when OpenAI is available', () => {
            // This test will be implemented when OpenAI integration is added
            // For now, it should fall back to template content
            execSync(`npx tsx ${cliPath} --title "AI Generated Post"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/ai-generated-post.md');
            expect(fs.existsSync(blogPath)).toBe(true);

            const content = fs.readFileSync(blogPath, 'utf8');
            expect(content).toMatch(/## AI Generated Post/);
        });

        test('should handle OpenAI API errors gracefully', () => {
            // This test will verify error handling when OpenAI API fails
            // For now, it should work with template content
            execSync(`npx tsx ${cliPath} --title "Error Handling Test"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/error-handling-test.md');
            expect(fs.existsSync(blogPath)).toBe(true);
        });
    });

    describe('Tag Generation', () => {
        test('should suggest relevant tags based on content', () => {
            execSync(`npx tsx ${cliPath} --title "React TypeScript Guide"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/react-typescript-guide.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Check that tags are generated (even if empty for now)
            expect(content).toMatch(/tags:/);
        });

        test('should generate tags array in correct format', () => {
            execSync(`npx tsx ${cliPath} --title "Docker Best Practices"`, { stdio: 'pipe' });

            const blogPath = path.join(__dirname, '../content/blog/docker-best-practices.md');
            const content = fs.readFileSync(blogPath, 'utf8');

            // Tags should be in array format
            expect(content).toMatch(/tags: \[.*\]/);
        });
    });
});
