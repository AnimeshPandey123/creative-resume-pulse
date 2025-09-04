export interface OpenAIConfig {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
}

export interface BlogConfig {
    defaultCoverImage: string;
    defaultTags: string[];
    contentStructure: string[];
    seoKeywords: string[];
}

export const openAIConfig: OpenAIConfig = {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7
};

export const blogConfig: BlogConfig = {
    defaultCoverImage: 'https://d1iukwsziul56d.cloudfront.net/drupal-prodv2/s3fs-public/2025-03/default-blog-image.webp',
    defaultTags: ['web-development', 'programming', 'tutorial'],
    contentStructure: [
        'Introduction',
        'Main Content',
        'Advanced Topics',
        'Conclusion'
    ],
    seoKeywords: ['web development', 'programming', 'tutorial', 'guide', 'best practices']
};

export const promptTemplate = (title: string, context?: string): string => `
Generate a comprehensive, technical blog post about: ${title}

${context ? `Context: ${context}` : ''}

Requirements:
- Write in a technical, educational tone suitable for developers
- Include practical code examples where relevant
- Structure with clear headings and subheadings
- Add relevant technical details and explanations
- Include a conclusion section
- Target reading time: 8-12 minutes
- Use proper markdown formatting
- Focus on practical, actionable insights
- Include bullet points and numbered lists where appropriate
- Make it engaging and informative for both beginners and experienced developers

Format the response as clean markdown without any additional formatting or explanations.
`;
