#!/usr/bin/env tsx

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAIBlogService } from './services/openai.js';
import { blogConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface BlogOptions {
    title: string;
    context?: string;
}

interface BlogMetadata {
    title: string;
    excerpt: string;
    publishDate: string;
    tags: string;
}

interface BlogPost {
    slug: string;
    metadata: BlogMetadata;
    content: string;
}

class BlogGenerator {
    private program: Command;
    private openAIService: OpenAIBlogService;

    constructor() {
        this.program = new Command();
        this.openAIService = new OpenAIBlogService();
        this.setupCLI();
    }

    private setupCLI(): void {
        this.program
            .name('generate-blog')
            .description('Generate a new blog post using AI')
            .requiredOption('-t, --title <title>', 'Blog post title')
            .option('-c, --context <context>', 'Optional context or description for the blog post')
            .action(async (options: BlogOptions) => await this.generateBlog(options));
    }

    private async generateBlog(options: BlogOptions): Promise<void> {
        try {
            const { title, context } = options;

            console.log(chalk.blue(`🚀 Generating blog post: "${title}"`));

            // Generate slug from title
            const slug = this.generateSlug(title);

            // Generate content using AI or fallback
            let content: string;
            let tags: string[];
            let excerpt: string;

            if (this.openAIService.isAvailable()) {
                console.log(chalk.yellow('🤖 Using OpenAI to generate content...'));

                try {
                    content = await this.openAIService.generateBlogContent(title, context);
                    tags = await this.openAIService.generateTags(content);
                    excerpt = await this.openAIService.generateExcerpt(content);

                    console.log(chalk.green('✅ AI content generated successfully!'));
                } catch (aiError) {
                    console.log(chalk.yellow('⚠️  AI generation failed, using fallback content...'));
                    content = this.generateFallbackContent(title, context);
                    tags = blogConfig.defaultTags;
                    excerpt = context || `Learn about ${title.toLowerCase()}`;
                }
            } else {
                console.log(chalk.yellow('📝 Using template content (OpenAI not configured)'));
                content = this.generateFallbackContent(title, context);
                tags = blogConfig.defaultTags;
                excerpt = context || `Learn about ${title.toLowerCase()}`;
            }

            // Generate metadata
            const metadata = this.generateMetadata(title, excerpt, tags);

            // Create blog post file
            this.createBlogPost(slug, metadata, content);

            console.log(chalk.green(`✅ Blog post "${title}" generated successfully!`));
            console.log(chalk.blue(`📁 File: src/content/blog/${slug}.md`));
            console.log(chalk.cyan(`🏷️  Tags: [${tags.join(', ')}]`));

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error(chalk.red('❌ Error generating blog post:'), errorMessage);
            process.exit(1);
        }
    }

    private generateSlug(title: string): string {
        return slugify(title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }

    private generateMetadata(title: string, excerpt: string, tags: string[]): BlogMetadata {
        const today = new Date().toISOString().split('T')[0];

        return {
            title: `"${title}"`,
            excerpt: `"${excerpt}"`,
            publishDate: `"${today}"`,
            tags: `[${tags.map(tag => `"${tag}"`).join(', ')}]`
        };
    }

    private generateFallbackContent(title: string, context?: string): string {
        return `## ${title}

${context || 'This is a comprehensive guide about ' + title.toLowerCase() + '.'}

### Introduction

This blog post will provide you with detailed information about ${title.toLowerCase()}. Whether you're a beginner looking to get started or an experienced developer seeking to deepen your knowledge, this guide covers everything you need to know.

### Main Content

In this comprehensive guide, we'll explore the fundamental concepts, best practices, and practical examples related to ${title.toLowerCase()}. We'll cover:

- Core concepts and principles
- Step-by-step implementation guides
- Common pitfalls and how to avoid them
- Real-world examples and use cases
- Performance optimization techniques
- Best practices for production environments

### Advanced Topics

Beyond the basics, we'll also dive into more advanced concepts that will help you master ${title.toLowerCase()} and apply it effectively in your projects.

### Conclusion

This concludes our comprehensive discussion about ${title.toLowerCase()}. By following the principles and examples outlined in this guide, you'll be well-equipped to tackle real-world challenges and build robust solutions.`;
    }

    private createBlogPost(slug: string, metadata: BlogMetadata, content: string): void {
        const blogDir = path.join(__dirname, '../src/content/blog');
        const blogPath = path.join(blogDir, `${slug}.md`);

        // Ensure blog directory exists
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }

        // Create frontmatter
        const frontmatter = `---
title: ${metadata.title}
excerpt: ${metadata.excerpt}
publishDate: ${metadata.publishDate}
tags: ${metadata.tags}
---

`;

        // Write blog post file
        fs.writeFileSync(blogPath, frontmatter + content);
    }

    public run(): void {
        this.program.parse();
    }
}

// Run the CLI
const generator = new BlogGenerator();
generator.run();
