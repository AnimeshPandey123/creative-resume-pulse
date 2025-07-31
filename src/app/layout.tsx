// app/layout.tsx (App Router style)

import type { Metadata } from 'next';
import './globals.css'; // adjust if your global styles file is different

export const metadata: Metadata = {
  title: 'Animesh Pandey | Senior Software Engineer | Full Stack Developer',
  description:
    'Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies.',
  keywords: [
    'Animesh Pandey',
    'Software Engineer',
    'PHP',
    'Python',
    'Backend Developer',
    'Full Stack Developer',
    'Web Engineer',
    'Software Portfolio',
  ],
  authors: [{ name: 'Animesh Pandey' }],
  openGraph: {
    type: 'website',
    title: 'Animesh Pandey | Senior Software Engineer',
    description:
      'Portfolio of Animesh Pandey, showcasing expertise in scalable backend solutions using PHP, Javascript, Python, and cloud technologies.',
    url: 'https://animeshpandey.com',
    siteName: 'Animesh Pandey Portfolio',
    images: [
      {
        url: 'https://animeshpandey.com/images/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Animesh Pandey Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animesh Pandey | Senior Software Engineer',
    description:
      'Portfolio of Animesh Pandey, experienced in backend development with PHP, Javascript and Python.',
    creator: '@animeshpandey',
    images: ['https://animeshpandey.com/images/opengraph-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
