# AI-Powered Blog Post Generator

A command-line tool that generates comprehensive blog posts using OpenAI's GPT models, with automatic SEO optimization and metadata generation.

## Features

- 🤖 **AI-Powered Content**: Generate high-quality blog posts using OpenAI GPT models
- 📝 **Smart Metadata**: Automatic excerpt generation, tag suggestions, and SEO optimization
- 🎯 **SEO Ready**: Proper heading structure, meta descriptions, and content optimization
- 🚀 **Easy to Use**: Simple CLI interface with title and optional context
- 🔄 **Fallback Support**: Graceful fallback to template content if AI is unavailable
- 📁 **File Management**: Automatic file creation with SEO-friendly naming

## Installation

The tool is already installed as part of this project. Make sure you have the required dependencies:

```bash
npm install
```

## Setup

### 1. OpenAI API Key

To use AI-powered content generation, you need an OpenAI API key:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set it as an environment variable:

```bash
export OPENAI_API_KEY="your_api_key_here"
```

Or add it to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
echo 'export OPENAI_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### 2. Optional Configuration

You can customize the OpenAI settings with these environment variables:

```bash
export OPENAI_MODEL="gpt-4"           # Model to use (default: gpt-4)
export OPENAI_MAX_TOKENS="2000"       # Max tokens (default: 2000)
export OPENAI_TEMPERATURE="0.7"       # Creativity level (default: 0.7)
```

## Usage

### Basic Usage

Generate a blog post with just a title:

```bash
npm run generate-blog -- --title "Your Blog Post Title"
```

### With Context

Provide additional context for better AI generation:

```bash
npm run generate-blog -- --title "React Hooks Guide" --context "Comprehensive guide covering useState, useEffect, and custom hooks with practical examples"
```

### Direct CLI Usage

You can also run the CLI directly:

```bash
npx tsx scripts/generate-blog.ts --title "Your Title" --context "Optional context"
```

## Output

The tool generates:

1. **Markdown File**: `src/content/blog/[slug].md` with proper frontmatter
2. **SEO Metadata**: Title, excerpt, publish date, and relevant tags
3. **Structured Content**: Well-formatted markdown with proper headings
4. **Console Feedback**: Progress updates and success confirmation

## File Structure

Generated blog posts follow this structure:

```markdown
---
title: "Your Blog Post Title"
excerpt: "AI-generated excerpt describing the content"
publishDate: "2024-12-09"
tags: ["tag1", "tag2", "tag3"]
---

## Your Blog Post Title

[AI-generated content with proper structure]

### Introduction
[Content...]

### Main Content
[Content...]

### Conclusion
[Content...]
```

## Fallback Mode

If OpenAI is not configured or fails:

- Uses template content structure
- Generates basic metadata
- Still creates properly formatted blog posts
- Provides clear console feedback

## Customization

### Content Structure

Modify `scripts/config.ts` to customize:

- Default tags
- Content structure
- SEO keywords
- Prompt templates

### OpenAI Prompts

Customize the AI generation prompts in `scripts/config.ts`:

```typescript
export const promptTemplate = (title: string, context?: string): string => `
  [Your custom prompt here]
`;
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Set the `OPENAI_API_KEY` environment variable
   - Restart your terminal after setting the variable

2. **"AI generation failed"**
   - Check your API key is valid
   - Verify you have OpenAI API credits
   - Check network connectivity

3. **TypeScript errors**
   - Ensure `tsx` is installed: `npm install -g tsx`
   - Run with `npx tsx` instead of `node`

### Getting Help

- Check the console output for detailed error messages
- Verify your OpenAI API key and billing status
- Ensure all dependencies are properly installed

## Development

### Running Tests

```bash
npm test -- src/__tests__/generate-blog.test.ts
```

### Adding Features

The tool is built with TypeScript and follows TDD principles:

1. Write tests first
2. Implement functionality
3. Ensure all tests pass
4. Add new features incrementally

## License

This tool is part of the creative-resume-pulse project.
# Test comment
# Test coverage enforcement
# Test coverage enforcement again
