import type { Metadata } from 'next';
import Layout from '@/layout/Layout';

export const metadata: Metadata = {
  title: 'Page not found | Animesh Pandey',
  description: 'The page you requested does not exist.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-background pt-32">
        <div className="section-container max-w-xl">
          <p className="section-kicker mb-4">Missing page</p>
          <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-4 text-foreground">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 text-foreground">
            Page Not Found
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <a href="/" className="text-link">
              Return to Home
            </a>
            <div className="text-sm text-muted-foreground">
              <p>Or try one of these pages:</p>
              <div className="mt-2 space-x-4">
                <a
                  href="/#about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </a>
                <a
                  href="/#projects"
                  className="hover:text-primary transition-colors"
                >
                  Projects
                </a>
                <a
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
