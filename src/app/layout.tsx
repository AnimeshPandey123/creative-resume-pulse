"use client";

import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const queryClient = new QueryClient();

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
        <title>Animesh Pandey | Senior Software Engineer | Full Stack Developer</title>
        <meta name="description" content="Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies." />
        <meta name="keywords" content="Animesh Pandey, Software Engineer, PHP, Python, Backend Developer, Full Stack Developer, Web Engineer, Software Portfolio, React, Node.js, TypeScript, AWS, Docker, Kubernetes" />
        <meta name="author" content="Animesh Pandey" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://animeshpandey.com" />

        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Animesh Pandey | Senior Software Engineer" />
        <meta property="og:description" content="Portfolio of Animesh Pandey, showcasing expertise in scalable backend solutions using PHP, Javascript, Python, and cloud technologies." />
        <meta property="og:image" content="https://animeshpandey.com/opengraph-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Animesh Pandey Portfolio" />
        <meta property="og:url" content="https://animeshpandey.com" />
        <meta property="og:site_name" content="Animesh Pandey Portfolio" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Animesh Pandey | Senior Software Engineer" />
        <meta name="twitter:description" content="Portfolio of Animesh Pandey, experienced in backend development with PHP, Javascript and Python." />
        <meta name="twitter:image" content="https://animeshpandey.com/opengraph-image.png" />
        <meta name="twitter:creator" content="@animeshpandey" />
        <meta name="twitter:site" content="@animeshpandey" />

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Fonts with display=swap for better performance */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Animesh Pandey",
            "jobTitle": "Senior Software Engineer",
            "description": "Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.",
            "url": "https://animeshpandey.com",
            "image": "https://animeshpandey.com/opengraph-image.png",
            "sameAs": [
              "https://github.com/animeshpandey",
              "https://linkedin.com/in/animeshpandey",
              "https://twitter.com/animeshpandey"
            ],
            "knowsAbout": [
              "PHP", "Python", "JavaScript", "React", "Node.js", "TypeScript",
              "Backend Development", "Full Stack Development", "Web Development",
              "AWS", "Docker", "Kubernetes", "MySQL", "PostgreSQL", "MongoDB"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Software Engineering"
            }
          })
        }} />

        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Animesh Pandey Portfolio",
            "url": "https://animeshpandey.com",
            "description": "Portfolio of Animesh Pandey, Senior Software Engineer",
            "author": {
              "@type": "Person",
              "name": "Animesh Pandey"
            },
            "publisher": {
              "@type": "Person",
              "name": "Animesh Pandey"
            }
          })
        }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <PerformanceOptimizer>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </PerformanceOptimizer>
        </QueryClientProvider>
      </body>
    </html>
  );
}
