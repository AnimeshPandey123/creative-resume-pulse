#!/usr/bin/env tsx

import chalk from 'chalk';
import { OpenAIBlogService } from './services/openai.js';
import { blogConfig } from './config.js';

console.log(chalk.blue('🚀 AI-Powered Blog Post Generator Demo'));
console.log(chalk.gray('=====================================\n'));

// Demo the OpenAI service
const openAIService = new OpenAIBlogService();

if (openAIService.isAvailable()) {
    console.log(chalk.green('✅ OpenAI service is available'));
    console.log(chalk.cyan('🤖 You can generate AI-powered content!'));
} else {
    console.log(chalk.yellow('⚠️  OpenAI service is not available'));
    console.log(chalk.cyan('📝 You can still use template content generation'));
    console.log(chalk.gray('   Set OPENAI_API_KEY environment variable to enable AI features'));
}

console.log('\n' + chalk.blue('📋 Available Configuration:'));
console.log(chalk.gray('Default Tags:'), blogConfig.defaultTags.join(', '));
console.log(chalk.gray('Content Structure:'), blogConfig.contentStructure.join(' → '));
console.log(chalk.gray('Default Cover Image:'), blogConfig.defaultCoverImage);

console.log('\n' + chalk.blue('💡 Usage Examples:'));
console.log(chalk.gray('Basic:'), 'npm run generate-blog -- --title "Your Title"');
console.log(chalk.gray('With Context:'), 'npm run generate-blog -- --title "Your Title" --context "Your context"');

console.log('\n' + chalk.blue('🔧 Setup Instructions:'));
console.log(chalk.gray('1.'), 'Get OpenAI API key from https://platform.openai.com/api-keys');
console.log(chalk.gray('2.'), 'Set environment variable: export OPENAI_API_KEY="your_key"');
console.log(chalk.gray('3.'), 'Run the generator and enjoy AI-powered content!');

console.log('\n' + chalk.green('✨ Happy blogging!'));
