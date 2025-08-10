// SEO Configuration for Animesh Pandey Portfolio
export const SEO_CONFIG = {
    // Site Information
    site: {
        name: 'Animesh Pandey Portfolio',
        url: 'https://animeshpandey.com',
        description: 'Senior Software Engineer Animesh Pandey - 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems, microservices, and AI integration. Based in Wolverhampton, UK.',
        author: 'Animesh Pandey',
        twitterHandle: '@animeshpandey',
        language: 'en',
        locale: 'en_US',
    },

    // Default Meta Tags
    default: {
        title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer | Backend Specialist',
        description: 'Senior Software Engineer Animesh Pandey - 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems, microservices, and AI integration. Based in Wolverhampton, UK.',
        keywords: [
            'Animesh Pandey',
            'Senior Software Engineer',
            'Full Stack Developer',
            'Backend Developer',
            'PHP Developer',
            'Python Developer',
            'Node.js Developer',
            'React Developer',
            'TypeScript Developer',
            'Microservices Architecture',
            'Docker Kubernetes',
            'AWS Cloud',
            'Database Optimization',
            'API Development',
            'CI/CD Pipeline',
            'Software Architecture',
            'Web Development',
            'Software Portfolio',
            'UK Software Engineer',
            'Wolverhampton Developer',
            'Laravel Developer',
            'Symfony Developer',
            'Flask Developer',
            'MySQL PostgreSQL',
            'MongoDB Elasticsearch',
            'RESTful APIs',
            'GraphQL',
            'AI Integration',
            'Machine Learning',
            'DevOps Engineer',
            'System Architecture',
            'Code Review',
            'Technical Leadership',
            'Mentoring',
            'Agile Development',
            'Test-Driven Development',
            'SOLID Principles'
        ],
        image: 'https://animeshpandey.com/opengraph-image.png',
        type: 'website' as const,
    },

    // Page-specific configurations
    pages: {
        home: {
            title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer | Backend Specialist',
            description: 'Senior Software Engineer Animesh Pandey - 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems, microservices, and AI integration. Based in Wolverhampton, UK.',
            keywords: [
                'Animesh Pandey',
                'Senior Software Engineer',
                'Full Stack Developer',
                'Backend Developer',
                'PHP Developer',
                'Python Developer',
                'Node.js Developer',
                'React Developer',
                'TypeScript Developer',
                'Microservices Architecture',
                'Docker Kubernetes',
                'AWS Cloud',
                'Database Optimization',
                'API Development',
                'CI/CD Pipeline',
                'Software Architecture',
                'Web Development',
                'Software Portfolio',
                'UK Software Engineer',
                'Wolverhampton Developer',
                'Laravel Developer',
                'Symfony Developer',
                'Flask Developer',
                'MySQL PostgreSQL',
                'MongoDB Elasticsearch',
                'RESTful APIs',
                'GraphQL',
                'AI Integration',
                'Machine Learning',
                'DevOps Engineer',
                'System Architecture',
                'Code Review',
                'Technical Leadership',
                'Mentoring',
                'Agile Development',
                'Test-Driven Development',
                'SOLID Principles'
            ],
            type: 'profile' as const,
        },
        blog: {
            title: 'Blog | Animesh Pandey - Software Engineering & Technology Insights',
            description: 'Explore articles on web development, programming, software architecture, and technology by Animesh Pandey. Insights, tutorials, and thoughts on modern software development, backend systems, and AI integration.',
            keywords: [
                'Blog',
                'Web Development',
                'Programming',
                'Technology',
                'Software Engineering',
                'Backend Development',
                'API Development',
                'Microservices',
                'DevOps',
                'AI Integration',
                'Animesh Pandey',
                'Software Architecture',
                'Code Reviews',
                'Best Practices',
                'Tutorials',
                'Technical Insights'
            ],
            type: 'website' as const,
        },
        notFound: {
            title: '404 - Page Not Found | Animesh Pandey',
            description: 'The page you\'re looking for doesn\'t exist. Return to the homepage to explore Animesh Pandey\'s portfolio.',
            keywords: ['404', 'Page Not Found', 'Animesh Pandey'],
            type: 'website' as const,
        },
    },

    // Structured Data
    structuredData: {
        person: {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Animesh Pandey',
            jobTitle: 'Senior Software Engineer',
            description: 'Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
            url: 'https://animeshpandey.com',
            image: 'https://animeshpandey.com/opengraph-image.png',
            sameAs: [
                'https://www.linkedin.com/in/animesh-pandey-26546213a',
                'https://animeshpandey.com'
            ],
            knowsAbout: [
                'PHP', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js',
                'Backend Development', 'Full Stack Development', 'Web Development',
                'AWS', 'Docker', 'Kubernetes', 'MySQL', 'PostgreSQL', 'MongoDB',
                'Microservices Architecture', 'API Development', 'CI/CD',
                'Laravel', 'Symfony', 'Flask', 'RESTful APIs', 'GraphQL',
                'Elasticsearch', 'Redis', 'RabbitMQ', 'DevOps', 'System Architecture',
                'AI Integration', 'Machine Learning', 'LangChain', 'LLMs'
            ],
            worksFor: {
                '@type': 'Organization',
                name: 'Software Engineering'
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Wolverhampton',
                addressCountry: 'UK'
            },
            alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'University of Wolverhampton'
            },
            hasOccupation: {
                '@type': 'Occupation',
                name: 'Senior Software Engineer',
                description: 'Backend development specialist with expertise in scalable systems'
            }
        },
        website: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Animesh Pandey Portfolio',
            url: 'https://animeshpandey.com',
            description: 'Portfolio of Animesh Pandey, Senior Software Engineer',
            author: {
                '@type': 'Person',
                name: 'Animesh Pandey'
            },
            publisher: {
                '@type': 'Person',
                name: 'Animesh Pandey'
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://animeshpandey.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        },
        organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Animesh Pandey Portfolio',
            url: 'https://animeshpandey.com',
            logo: 'https://animeshpandey.com/opengraph-image.png',
            description: 'Professional portfolio showcasing software engineering expertise',
            founder: {
                '@type': 'Person',
                name: 'Animesh Pandey'
            }
        }
    },

    // Social Media
    social: {
        twitter: {
            card: 'summary_large_image',
            creator: '@animeshpandey',
            site: '@animeshpandey',
        },
        facebook: {
            appId: '', // Add if you have a Facebook app
        },
    },

    // Performance and Security
    performance: {
        preload: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            '/favicon.ico'
        ],
        dnsPrefetch: [
            '//fonts.googleapis.com',
            '//fonts.gstatic.com'
        ],
    },

    // Security Headers
    security: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
};

// Helper function to generate page-specific SEO data
export const generatePageSEO = (page: keyof typeof SEO_CONFIG.pages, customData?: Partial<typeof SEO_CONFIG.default>) => {
    const pageConfig = SEO_CONFIG.pages[page];
    const defaultConfig = SEO_CONFIG.default;

    return {
        title: customData?.title || pageConfig.title,
        description: customData?.description || pageConfig.description,
        keywords: customData?.keywords || pageConfig.keywords,
        image: customData?.image || defaultConfig.image,
        type: customData?.type || pageConfig.type,
        url: `${SEO_CONFIG.site.url}${page === 'home' ? '' : `/${page}`}`,
    };
};

// Helper function to generate structured data for blog posts
export const generateBlogPostStructuredData = (post: {
    title: string;
    description: string;
    image: string;
    publishDate: string;
    author: string;
    url: string;
    tags: string[];
}) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
        '@type': 'Person',
        name: post.author,
        url: 'https://animeshpandey.com'
    },
    publisher: {
        '@type': 'Person',
        name: 'Animesh Pandey',
        url: 'https://animeshpandey.com'
    },
    description: post.description,
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': post.url
    },
    keywords: post.tags.join(', '),
    articleSection: post.tags.length > 0 ? post.tags[0] : 'Technology',
    wordCount: post.description.split(' ').length,
    inLanguage: 'en-US',
    isAccessibleForFree: true
});

// Helper function to generate comprehensive structured data for the portfolio
export const generatePortfolioStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Animesh Pandey Portfolio',
    description: 'Professional portfolio showcasing software engineering projects and expertise',
    author: {
        '@type': 'Person',
        name: 'Animesh Pandey',
        jobTitle: 'Senior Software Engineer',
        url: 'https://animeshpandey.com'
    },
    dateCreated: '2024',
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    genre: 'Portfolio',
    keywords: SEO_CONFIG.default.keywords.join(', ')
});

export default SEO_CONFIG; 