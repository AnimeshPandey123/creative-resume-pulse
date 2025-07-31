import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Animesh Pandey | Senior Software Engineer | Full Stack Developer',
    description = 'Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
    keywords = [
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
    image = 'https://animeshpandey.com/images/opengraph-image.png',
    url = 'https://animeshpandey.com',
    type = 'website',
    author = 'Animesh Pandey',
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    structuredData
}) => {
    const siteName = 'Animesh Pandey Portfolio';
    const twitterHandle = '@animeshpandey';

    // Default structured data for Person
    const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Animesh Pandey',
        jobTitle: 'Senior Software Engineer',
        description: 'Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
        url: 'https://animeshpandey.com',
        image: 'https://animeshpandey.com/images/opengraph-image.png',
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
    };

    const finalStructuredData = structuredData || defaultStructuredData;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content={author} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />

            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {author && <meta property="article:author" content={author} />}
            {section && <meta property="article:section" content={section} />}
            {tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:site" content={twitterHandle} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(finalStructuredData)}
            </script>

            {/* Additional SEO Meta Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="theme-color" content="#000000" />
            <meta name="color-scheme" content="light dark" />
            <meta name="format-detection" content="telephone=no" />

            {/* Security Headers */}
            <meta http-equiv="X-Content-Type-Options" content="nosniff" />
            <meta http-equiv="X-Frame-Options" content="DENY" />
            <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
            <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        </Helmet>
    );
};

export default SEO; 