#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishDate: string;
    readingTime: number;
    authorId: string;
    tagIds: string[];
    contentPath: string;
}

interface BlogData {
    authors: any[];
    tags: any[];
    posts: BlogPost[];
}

class BlogDataSyncer {
    private blogDir: string;
    private jsonPath: string;
    private defaultCoverImage: string;
    private defaultTags: string[];

    constructor() {
        this.blogDir = path.join(__dirname, '../src/content/blog');
        this.jsonPath = path.join(__dirname, '../src/data/blog-posts.json');
        this.defaultCoverImage = 'https://d1iukwsziul56d.cloudfront.net/drupal-prodv2/s3fs-public/2025-03/default-blog-image.webp';
        this.defaultTags = ['web-development', 'programming', 'tutorial'];
    }

    async sync(): Promise<void> {
        try {
            console.log(chalk.blue('🔄 Syncing blog data...'));

            // Read existing JSON data
            const existingData = this.readExistingData();

            // Get all markdown files
            const markdownFiles = this.getMarkdownFiles();

            // Process each markdown file
            const newPosts: BlogPost[] = [];
            const existingSlugs = new Set(existingData.posts.map(post => post.slug));

            for (const file of markdownFiles) {
                const slug = path.basename(file, '.md');

                if (!existingSlugs.has(slug)) {
                    const post = await this.createPostFromMarkdown(file, slug);
                    if (post) {
                        newPosts.push(post);
                        console.log(chalk.green(`✅ Added new post: ${post.title}`));
                    }
                }
            }

            if (newPosts.length === 0) {
                console.log(chalk.yellow('ℹ️  No new posts to sync'));
                return;
            }

            // Add new posts to existing data
            existingData.posts.push(...newPosts);

            // Write updated JSON
            this.writeJsonData(existingData);

            console.log(chalk.green(`✅ Successfully synced ${newPosts.length} new blog post(s)`));
            console.log(chalk.blue(`📁 Updated: ${this.jsonPath}`));

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error(chalk.red('❌ Error syncing blog data:'), errorMessage);
            process.exit(1);
        }
    }

    private readExistingData(): BlogData {
        if (!fs.existsSync(this.jsonPath)) {
            throw new Error(`Blog data file not found: ${this.jsonPath}`);
        }

        const content = fs.readFileSync(this.jsonPath, 'utf-8');
        return JSON.parse(content);
    }

    private getMarkdownFiles(): string[] {
        if (!fs.existsSync(this.blogDir)) {
            return [];
        }

        return fs.readdirSync(this.blogDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.blogDir, file));
    }

    private async createPostFromMarkdown(filePath: string, slug: string): Promise<BlogPost | null> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(content);

            // Generate a unique ID
            const id = this.generateId();

            // Calculate reading time (rough estimate: 200 words per minute)
            const wordCount = content.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);

            // Map tags to tag IDs (you may need to adjust this based on your existing tags)
            const tagIds = this.mapTagsToIds(data.tags || this.defaultTags);

            const post: BlogPost = {
                id,
                title: data.title?.replace(/"/g, '') || slug.replace(/-/g, ' '),
                slug,
                excerpt: data.excerpt?.replace(/"/g, '') || `Learn about ${slug.replace(/-/g, ' ')}`,
                coverImage: this.defaultCoverImage,
                publishDate: data.publishDate?.replace(/"/g, '') || new Date().toISOString().split('T')[0],
                readingTime,
                authorId: '1', // Default author ID
                tagIds,
                contentPath: `src/content/blog/${slug}.md`
            };

            return post;
        } catch (error) {
            console.warn(chalk.yellow(`⚠️  Warning: Could not process ${filePath}: ${error}`));
            return null;
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private mapTagsToIds(tags: string[]): string[] {
        // This is a simple mapping - you may need to enhance this based on your existing tags
        const tagMapping: { [key: string]: string } = {
            'web-development': '6',
            'programming': '5',
            'tutorial': '1',
            'javascript': '5',
            'react': '5',
            'nextjs': '9',
            'typescript': '5',
            'css': '6',
            'html': '6'
        };

        return tags
            .map(tag => tagMapping[tag.toLowerCase()] || '6') // Default to web-development
            .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
    }

    private writeJsonData(data: BlogData): void {
        const jsonContent = JSON.stringify(data, null, 4);
        fs.writeFileSync(this.jsonPath, jsonContent, 'utf-8');
    }
}

// Run the syncer
const syncer = new BlogDataSyncer();
syncer.sync();
