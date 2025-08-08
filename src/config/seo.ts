// SEO Configuration for Animesh Pandey Portfolio
export const SEO_CONFIG = {
    // Site Information
    site: {
        name: 'Animesh Pandey Portfolio',
        url: 'https://animeshpandey.com',
        description: 'Portfolio of Animesh Pandey, Senior Software Engineer with expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
        author: 'Animesh Pandey',
        twitterHandle: '@animeshpandey',
        language: 'en',
        locale: 'en_US',
    },

    // Default Meta Tags
    default: {
        title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer',
        description: 'Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
        keywords: [
            'Animesh Pandey',
            'Software Engineer',
            'PHP',
            'Python',
            'Backend Developer',
            'Full Stack Developer',
            'Web Engineer',
            'Software Portfolio',
            'React',
            'Node.js',
            'TypeScript',
            'AWS',
            'Docker',
            'Kubernetes'
        ],
        image: 'https://animeshpandey.com/opengraph-image.png',
        type: 'website' as const,
    },

    // Page-specific configurations
    pages: {
        home: {
            title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer',
            description: 'Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
            keywords: [
                'Animesh Pandey',
                'Software Engineer',
                'PHP',
                'Python',
                'Backend Developer',
                'Full Stack Developer',
                'Web Engineer',
                'Software Portfolio',
                'React',
                'Node.js',
                'TypeScript',
                'AWS',
                'Docker',
                'Kubernetes'
            ],
            type: 'profile' as const,
        },
        blog: {
            title: 'Blog | Animesh Pandey',
            description: 'Explore articles on web development, programming, and technology by Animesh Pandey. Insights, tutorials, and thoughts on modern software development.',
            keywords: [
                'Blog',
                'Web Development',
                'Programming',
                'Technology',
                'Software Engineering',
                'Animesh Pandey'
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
                'https://github.com/animeshpandey',
                'https://linkedin.com/in/animeshpandey',
                'https://twitter.com/animeshpandey'
            ],
            knowsAbout: [
                'PHP', 'Python', 'JavaScript', 'React', 'Node.js', 'TypeScript',
                'Backend Development', 'Full Stack Development', 'Web Development',
                'AWS', 'Docker', 'Kubernetes', 'MySQL', 'PostgreSQL', 'MongoDB'
            ],
            worksFor: {
                '@type': 'Organization',
                name: 'Software Engineering'
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
});

export default SEO_CONFIG; 