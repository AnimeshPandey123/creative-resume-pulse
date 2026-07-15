import React, { Suspense } from 'react';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import ClientProviders from '@/components/ClientProviders';
import HotjarAnalytics from '@/components/Hotjar';
import RouteTracker from '@/components/RouteTracker';
import { baseMetadata, mainStructuredData } from '@/config/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=stored==='dark'||stored==='light'?stored:(prefersDark?'dark':'light');document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(theme);}catch(e){}})();`,
          }}
        />
        {/* Critical Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://d1iukwsziul56d.cloudfront.net" />
        <link rel="preconnect" href="https://dev-to-uploads.s3.amazonaws.com" />

        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//d1iukwsziul56d.cloudfront.net" />
        <link rel="dns-prefetch" href="//dev-to-uploads.s3.amazonaws.com" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/favicon.ico"
          as="image"
          type="image/x-icon"
        />
        <link
          rel="preload"
          href="/opengraph-image.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/apple-touch-icon.png"
          as="image"
          type="image/png"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Animesh Pandey Blog RSS Feed"
          href="/feed.xml"
        />

        {/* Structured Data */}
        {mainStructuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data),
            }}
          />
        ))}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''}
        />
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <HotjarAnalytics />
      </body>
    </html>
  );
}
