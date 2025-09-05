import OpenAI from 'openai';
import { openAIConfig, promptTemplate } from '../config.js';

export interface OpenAIService {
  generateBlogContent(title: string, context?: string): Promise<string>;
  generateTags(content: string): Promise<string[]>;
  generateExcerpt(content: string): Promise<string>;
}

export class OpenAIBlogService implements OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    if (openAIConfig.apiKey) {
      this.client = new OpenAI({
        apiKey: openAIConfig.apiKey,
      });
    }
  }

  async generateBlogContent(title: string, context?: string): Promise<string> {
    if (!this.client) {
      throw new Error(
        'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
      );
    }

    try {
      const prompt = promptTemplate(title, context);

      const completion = await this.client.chat.completions.create({
        model: openAIConfig.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert technical writer specializing in software development and programming tutorials. Write clear, engaging, and informative content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: openAIConfig.maxTokens,
        temperature: openAIConfig.temperature,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      return content;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown OpenAI error';
      throw new Error(`Failed to generate content: ${errorMessage}`);
    }
  }

  async generateTags(content: string): Promise<string[]> {
    if (!this.client) {
      return ['web-development', 'programming', 'tutorial'];
    }

    try {
      const prompt = `Analyze the following blog post content and suggest 3-5 relevant tags. Return only the tags as a JSON array of strings, no other text:

Content:
${content.substring(0, 500)}...

Tags:`;

      const completion = await this.client.chat.completions.create({
        model: openAIConfig.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a content tagging expert. Return only valid JSON arrays of tag strings.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return ['web-development', 'programming', 'tutorial'];
      }

      try {
        const tags = JSON.parse(response);
        return Array.isArray(tags)
          ? tags
          : ['web-development', 'programming', 'tutorial'];
      } catch {
        return ['web-development', 'programming', 'tutorial'];
      }
    } catch {
      return ['web-development', 'programming', 'tutorial'];
    }
  }

  async generateExcerpt(content: string): Promise<string> {
    if (!this.client) {
      return this.generateFallbackExcerpt(content);
    }

    try {
      const prompt = `Generate a compelling 2-3 sentence excerpt for this blog post. Make it engaging and informative:

Content:
${content.substring(0, 300)}...

Excerpt:`;

      const completion = await this.client.chat.completions.create({
        model: openAIConfig.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at writing compelling blog post excerpts. Write concise, engaging descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.5,
      });

      const excerpt = completion.choices[0]?.message?.content;
      if (!excerpt) {
        return this.generateFallbackExcerpt(content);
      }

      return excerpt.trim();
    } catch {
      return this.generateFallbackExcerpt(content);
    }
  }

  private generateFallbackExcerpt(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ').trim() + '.';
    }
    return 'Learn about this topic with our comprehensive guide.';
  }

  isAvailable(): boolean {
    return !!this.client;
  }
}
