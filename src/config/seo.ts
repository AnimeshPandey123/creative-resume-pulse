import { Metadata } from 'next';

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export const SITE_CONFIG = {
    name: 'Animesh Pandey',
    title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer | Backend Specialist',
    description: 'Senior Software Engineer Animesh Pandey - 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems, microservices, and AI integration. Based in Wolverhampton, UK.',
    url: 'https://animeshpandey.com',
    ogImage: 'https://animeshpandey.com/opengraph-image.png',
    twitterHandle: '@animeshpandey',
    author: {
        name: 'Animesh Pandey',
        twitter: '@animeshpandey',
        linkedin: 'https://www.linkedin.com/in/animesh-pandey-26546213a',
    },
    language: 'en',
    locale: 'en_US',
} as const;

// ============================================================================
// BASE METADATA
// ============================================================================

export const baseMetadata: Metadata = {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
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
    authors: [{ name: SITE_CONFIG.author.name }],
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
        canonical: SITE_CONFIG.url,
    },
    openGraph: {
        type: 'website',
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        siteName: `${SITE_CONFIG.name} Portfolio`,
        locale: SITE_CONFIG.locale,
        images: [
            {
                url: SITE_CONFIG.ogImage,
                width: 1200,
                height: 630,
                alt: `${SITE_CONFIG.name} - Senior Software Engineer Portfolio`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        images: [SITE_CONFIG.ogImage],
        creator: SITE_CONFIG.twitterHandle,
        site: SITE_CONFIG.twitterHandle,
    },
    other: {
        'theme-color': '#000000',
        'color-scheme': 'light dark',
        'format-detection': 'telephone=no',
        'google-site-verification': '', // Add your Google Search Console verification code
    },
};

// ============================================================================
// PAGE METADATA GENERATION
// ============================================================================

export function generatePageMetadata({
    title,
    description,
    path = '',
    keywords = [],
    type = 'website',
    image,
}: {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    type?: 'website' | 'article';
    image?: string;
}): Metadata {
    const url = `${SITE_CONFIG.url}${path}`;
    const fullTitle = path ? `${title} | ${SITE_CONFIG.name}` : title;

    return {
        title: fullTitle,
        description,
        keywords: [...baseMetadata.keywords as string[], ...keywords],
        authors: baseMetadata.authors,
        robots: baseMetadata.robots,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type,
            title: fullTitle,
            description,
            url,
            siteName: `${SITE_CONFIG.name} Portfolio`,
            locale: SITE_CONFIG.locale,
            images: [
                {
                    url: image || SITE_CONFIG.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${fullTitle} - ${SITE_CONFIG.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image || SITE_CONFIG.ogImage],
            creator: SITE_CONFIG.twitterHandle,
            site: SITE_CONFIG.twitterHandle,
        },
        other: baseMetadata.other,
    };
}

// ============================================================================
// PREDEFINED PAGE METADATA
// ============================================================================

export const pageMetadata = {
    home: baseMetadata,

    about: generatePageMetadata({
        title: 'About',
        description: 'Learn more about Animesh Pandey, a Senior Software Engineer with 6+ years of experience in full-stack development, specializing in backend systems and microservices architecture.',
        path: '/about',
        keywords: ['About Animesh Pandey', 'Software Engineer Background', 'Professional Experience'],
    }),

    experience: generatePageMetadata({
        title: 'Experience',
        description: 'Explore Animesh Pandey\'s professional experience, including roles at leading companies and expertise in PHP, Python, Node.js, React, and modern web technologies.',
        path: '/experience',
        keywords: ['Work Experience', 'Professional Background', 'Career History', 'Job Experience'],
    }),

    projects: generatePageMetadata({
        title: 'Projects',
        description: 'Discover Animesh Pandey\'s portfolio of software projects, showcasing expertise in web development, API design, microservices, and modern technologies.',
        path: '/projects',
        keywords: ['Portfolio Projects', 'Software Projects', 'Web Applications', 'API Projects'],
    }),

    skills: generatePageMetadata({
        title: 'Skills',
        description: 'Comprehensive overview of Animesh Pandey\'s technical skills including programming languages, frameworks, tools, and technologies.',
        path: '/skills',
        keywords: ['Technical Skills', 'Programming Languages', 'Frameworks', 'Technologies'],
    }),

    education: generatePageMetadata({
        title: 'Education',
        description: 'Educational background and qualifications of Animesh Pandey, including academic achievements and professional certifications.',
        path: '/education',
        keywords: ['Education', 'Qualifications', 'Academic Background', 'Certifications'],
    }),

    contact: generatePageMetadata({
        title: 'Contact',
        description: 'Get in touch with Animesh Pandey for collaboration opportunities, project inquiries, or professional networking.',
        path: '/contact',
        keywords: ['Contact Information', 'Get In Touch', 'Professional Contact', 'Collaboration'],
    }),

    blog: generatePageMetadata({
        title: 'Blog',
        description: 'Explore software engineering insights, tutorials, and technical articles by Animesh Pandey. Covering PHP, Python, Node.js, React, TypeScript, and modern web development practices.',
        path: '/blog',
        keywords: [
            'Software Engineering Blog',
            'Web Development Tutorials',
            'PHP Development',
            'Python Programming',
            'Node.js Development',
            'React Tutorials',
            'TypeScript Tips',
            'Backend Development',
            'Microservices Architecture',
            'API Development',
            'DevOps Practices',
            'Database Optimization',
            'Software Architecture',
            'Technical Articles',
            'Programming Tips',
            'Code Reviews',
            'Best Practices',
            'Software Engineering Insights'
        ],
    }),

    notFound: generatePageMetadata({
        title: '404 - Page Not Found',
        description: 'The page you\'re looking for doesn\'t exist. Return to the homepage to explore Animesh Pandey\'s portfolio.',
        path: '/404',
        keywords: ['404', 'Page Not Found', 'Animesh Pandey'],
    }),
} as const;

// ============================================================================
// BLOG METADATA
// ============================================================================

export const blogMetadata = pageMetadata.blog;

export function generateBlogPostMetadata(post: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    tags?: string[];
}): Metadata {
    const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

    return {
        title: `${post.title} | ${SITE_CONFIG.name} Blog`,
        description: post.description,
        keywords: [
            ...(post.tags || []),
            'Software Engineering',
            'Web Development',
            'Programming',
            'Technical Article',
            SITE_CONFIG.name
        ],
        authors: [{ name: SITE_CONFIG.author.name }],
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: postUrl,
            siteName: `${SITE_CONFIG.name} Portfolio`,
            locale: SITE_CONFIG.locale,
            publishedTime: post.publishedAt,
            images: [
                {
                    url: SITE_CONFIG.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${post.title} - ${SITE_CONFIG.name} Blog`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [SITE_CONFIG.ogImage],
            creator: SITE_CONFIG.twitterHandle,
            site: SITE_CONFIG.twitterHandle,
        },
    };
}

// ============================================================================
// STRUCTURED DATA
// ============================================================================

// Person structured data
export const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.name,
    jobTitle: 'Senior Software Engineer',
    description: 'Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
    url: SITE_CONFIG.url,
    image: SITE_CONFIG.ogImage,
    sameAs: [
        SITE_CONFIG.author.linkedin,
        SITE_CONFIG.url
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
};

// Website structured data
export const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_CONFIG.name} Portfolio`,
    url: SITE_CONFIG.url,
    description: `Portfolio of ${SITE_CONFIG.name}, Senior Software Engineer`,
    author: {
        '@type': 'Person',
        name: SITE_CONFIG.name
    },
    publisher: {
        '@type': 'Person',
        name: SITE_CONFIG.name
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
    }
};

// Organization structured data
export const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${SITE_CONFIG.name} Portfolio`,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.ogImage,
    description: 'Professional portfolio showcasing software engineering expertise',
    founder: {
        '@type': 'Person',
        name: SITE_CONFIG.name
    }
};

// Portfolio structured data
export const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${SITE_CONFIG.name} Portfolio`,
    description: 'Professional portfolio showcasing software engineering projects and expertise',
    author: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
        jobTitle: 'Senior Software Engineer',
        url: SITE_CONFIG.url
    },
    dateCreated: '2024',
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    genre: 'Portfolio',
    keywords: 'Software Engineering, Web Development, Backend Development, PHP, Python, Node.js, React, TypeScript, Microservices, API Development'
};

// Blog structured data
export const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_CONFIG.name} Blog`,
    description: 'Software engineering insights, tutorials, and technical articles',
    url: `${SITE_CONFIG.url}/blog`,
    author: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url
    },
    publisher: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true
};

// Function to generate blog post structured data
export function generateBlogPostStructuredData(post: {
    title: string;
    description: string;
    image?: string;
    publishDate: string;
    author: string;
    url: string;
    tags: string[];
    slug: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image || SITE_CONFIG.ogImage,
        datePublished: post.publishDate,
        dateModified: post.publishDate,
        author: {
            '@type': 'Person',
            name: post.author,
            url: SITE_CONFIG.url
        },
        publisher: {
            '@type': 'Person',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url
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
        isAccessibleForFree: true,
        url: post.url,
        identifier: post.slug
    };
}

// Function to generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

// Function to generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

// Function to generate project structured data
export function generateProjectStructuredData(project: {
    name: string;
    description: string;
    url?: string;
    image?: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        url: project.url,
        image: project.image || SITE_CONFIG.ogImage,
        author: {
            '@type': 'Person',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url
        },
        dateCreated: project.startDate,
        dateModified: project.endDate || new Date().toISOString(),
        inLanguage: 'en-US',
        genre: 'Software Project',
        keywords: project.technologies.join(', '),
        creator: {
            '@type': 'Person',
            name: SITE_CONFIG.name
        }
    };
}

// ============================================================================
// STRUCTURED DATA ARRAYS
// ============================================================================

// Main structured data for the homepage
export const mainStructuredData = [
    personStructuredData,
    websiteStructuredData,
    organizationStructuredData,
    portfolioStructuredData
];

// Blog structured data for the blog page
export const blogPageStructuredData = [
    blogStructuredData,
    personStructuredData
];

// ============================================================================
// BLOG CONFIGURATION
// ============================================================================

export const BLOG_CONFIG = {
    baseUrl: `${SITE_CONFIG.url}/blog`,
    postsPerPage: 6,
    defaultImage: SITE_CONFIG.ogImage,
    author: SITE_CONFIG.author,
    categories: [
        'Software Engineering',
        'Web Development',
        'Backend Development',
        'Frontend Development',
        'DevOps',
        'Database',
        'API Development',
        'Best Practices',
        'Tutorials',
        'Code Reviews'
    ] as const,
} as const;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// Legacy function names for backward compatibility
export const generatePortfolioStructuredData = () => portfolioStructuredData;

// Default export for backward compatibility
export default {
    SITE_CONFIG,
    baseMetadata,
    pageMetadata,
    blogMetadata,
    mainStructuredData,
    blogPageStructuredData,
    BLOG_CONFIG,
}; 