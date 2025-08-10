import React from 'react';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import ClientProviders from '@/components/ClientProviders';
import { generatePortfolioStructuredData } from '@/config/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
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
  authors: [{ name: 'Animesh Pandey' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://animeshpandey.com',
  },
  openGraph: {
    type: 'website',
    title: 'Animesh Pandey | Senior Software Engineer | Backend Specialist',
    description: 'Senior Software Engineer with 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems and microservices architecture.',
    url: 'https://animeshpandey.com',
    siteName: 'Animesh Pandey Portfolio',
    locale: 'en_US',
    images: [
      {
        url: 'https://animeshpandey.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Animesh Pandey - Senior Software Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animesh Pandey | Senior Software Engineer | Backend Specialist',
    description: 'Senior Software Engineer with 6+ years expertise in PHP, Python, Node.js, React, TypeScript, Docker, Kubernetes. Specializing in scalable backend systems.',
    images: ['https://animeshpandey.com/opengraph-image.png'],
    creator: '@animeshpandey',
    site: '@animeshpandey',
  },
  other: {
    'theme-color': '#000000',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
    'google-site-verification': '', // Add your Google Search Console verification code
  },
};

// Structured data for the main page
const structuredData = {
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
    'Elasticsearch', 'Redis', 'RabbitMQ', 'DevOps', 'System Architecture'
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
  }
};

// Portfolio structured data
const portfolioStructuredData = generatePortfolioStructuredData();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioStructuredData),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
