# Animesh Pandey Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. This project showcases the professional portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of experience in full-stack development.

## 🚀 Features

### Core Features
- **Modern Tech Stack**: Built with Next.js 15, React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Dark/Light Theme**: Built-in theme switching with system preference detection
- **SEO Optimized**: Comprehensive SEO with structured data, meta tags, and sitemap generation
- **Performance Optimized**: Optimized images, lazy loading, and performance monitoring
- **Blog System**: AI-powered blog post generation with RSS feed support
- **Contact Form**: Functional contact form with email integration
- **Analytics**: Integrated with Vercel Analytics, Google Analytics, and Hotjar

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Custom UI components built with Radix UI primitives
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Code Quality**: ESLint, Prettier, and Husky for code quality enforcement
- **CI/CD**: Automated testing and deployment with Vercel
- **Static Generation**: Support for both static and server-side rendering

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

### Backend & APIs
- **API Routes**: Next.js API routes
- **Email Service**: Resend for contact form
- **Content Management**: Markdown-based blog system
- **AI Integration**: OpenAI GPT for blog post generation

### Development & Testing
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Type Checking**: TypeScript with strict configuration
- **Package Manager**: npm with lock file

### Deployment & Analytics
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics, Google Analytics, Hotjar
- **Performance**: Vercel Speed Insights
- **SEO**: Structured data, sitemap, RSS feed

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── blog/              # Blog pages and routing
│   │   ├── feed.xml/          # RSS feed generation
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── blog/              # Blog-specific components
│   │   ├── ui/                # Reusable UI components
│   │   └── [sections].tsx     # Page sections
│   ├── config/                # Configuration files
│   │   └── seo.ts             # SEO and metadata configuration
│   ├── content/               # Content files
│   │   └── blog/              # Blog post markdown files
│   ├── data/                  # Static data files
│   ├── hooks/                 # Custom React hooks
│   ├── layout/                # Layout components
│   ├── lib/                   # Utility functions
│   ├── seo/                   # SEO utilities
│   └── types/                 # TypeScript type definitions
├── scripts/                   # Build and utility scripts
│   ├── generate-blog.ts       # AI blog post generator
│   ├── generate-sitemap.js    # Sitemap generation
│   └── services/              # External service integrations
├── public/                    # Static assets
├── __tests__/                 # Test files
└── configuration files        # Various config files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/animesh-pandey-portfolio.git
   cd animesh-pandey-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id
   NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
   
   # Email Service (for contact form)
   RESEND_API_KEY=your_resend_api_key
   
   # AI Blog Generation (optional)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run dev:static       # Start with static export config
npm run dev:server       # Start with server-side config
```

### Building
```bash
npm run build            # Build for production
npm run build:static     # Build for static export
npm run build:server     # Build for server deployment
npm run start            # Start production server
```

### Testing
```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run audit            # Run security audit
```

### Blog Management
```bash
npm run generate-blog    # Generate AI blog post
npm run sync-blog        # Sync blog data
npm run test-rss         # Test RSS feed
```

## 🎨 Customization

### Theme Configuration
The project uses a custom design system built on Tailwind CSS. Customize colors, fonts, and spacing in:
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Global styles and CSS variables

### Content Management
- **Portfolio Data**: Edit `src/data/` files for personal information
- **Blog Posts**: Add markdown files to `src/content/blog/`
- **SEO**: Update `src/config/seo.ts` for site-wide SEO settings

### Component Customization
- **UI Components**: Modify components in `src/components/ui/`
- **Page Sections**: Update section components in `src/components/`
- **Layout**: Customize layout in `src/layout/`

## 🤖 AI Blog Generation

The project includes an AI-powered blog post generator using OpenAI's GPT models:

### Setup
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set the environment variable:
   ```bash
   export OPENAI_API_KEY="your_api_key_here"
   ```

### Usage
```bash
# Generate a blog post with title
npm run generate-blog -- --title "Your Blog Post Title"

# Generate with additional context
npm run generate-blog -- --title "React Hooks Guide" --context "Comprehensive guide covering useState, useEffect, and custom hooks"
```

### Features
- 🤖 AI-powered content generation
- 📝 Automatic metadata and SEO optimization
- 🎯 Smart tag suggestions
- 🔄 Fallback to template content if AI unavailable
- 📁 Automatic file creation with SEO-friendly naming

## 🧪 Testing

The project includes comprehensive testing with Jest and React Testing Library:

### Test Coverage
- **Components**: All React components have unit tests
- **Pages**: Page components have smoke tests
- **Utilities**: Utility functions are fully tested
- **SEO**: SEO configuration is tested
- **Blog**: Blog functionality is tested

### Running Tests
```bash
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
npm run test:watch        # Run in watch mode
```

### Coverage Requirements
- **Branches**: 95%
- **Functions**: 95%
- **Lines**: 95%
- **Statements**: 95%

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

### Static Export
```bash
npm run build:static
npm run serve-export
```

## 📊 Performance & SEO

### Performance Features
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Optimized caching strategies
- **Bundle Analysis**: Webpack bundle optimization

### SEO Features
- **Structured Data**: JSON-LD structured data for all pages
- **Meta Tags**: Comprehensive meta tag configuration
- **Sitemap**: Automatic sitemap generation
- **RSS Feed**: Blog RSS feed at `/feed.xml`
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization

## 🔧 Configuration Files

### Key Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration
- `eslint.config.mjs` - ESLint configuration
- `vercel.json` - Vercel deployment configuration

## 📚 Documentation

### Additional Documentation
- [Scripts README](./scripts/README.md) - AI blog generation documentation
- [Component Tests](./src/components/__tests__/) - Component testing examples
- [SEO Configuration](./src/config/seo.ts) - SEO and metadata setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure all tests pass
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Animesh Pandey**
- Email: animeshpandey.pro@gmail.com
- LinkedIn: [animesh-pandey-26546213a](https://www.linkedin.com/in/animesh-pandey-26546213a)
- Website: [animeshpandey.com](https://animeshpandey.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Vercel](https://vercel.com/) - Deployment platform
- [OpenAI](https://openai.com/) - AI blog generation