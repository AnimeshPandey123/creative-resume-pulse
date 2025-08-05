import React from 'react';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
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
  authors: [{ name: 'Animesh Pandey' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://animeshpandey.com',
  },
  openGraph: {
    type: 'website',
    title: 'Animesh Pandey | Senior Software Engineer',
    description: 'Portfolio of Animesh Pandey, showcasing expertise in scalable backend solutions using PHP, Javascript, Python, and cloud technologies.',
    url: 'https://animeshpandey.com',
    siteName: 'Animesh Pandey Portfolio',
    locale: 'en_US',
    images: [
      {
        url: 'https://animeshpandey.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Animesh Pandey Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animesh Pandey | Senior Software Engineer',
    description: 'Portfolio of Animesh Pandey, experienced in backend development with PHP, Javascript and Python.',
    images: ['https://animeshpandey.com/opengraph-image.png'],
    creator: '@animeshpandey',
    site: '@animeshpandey',
  },
  other: {
    'theme-color': '#000000',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
  },
};

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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
