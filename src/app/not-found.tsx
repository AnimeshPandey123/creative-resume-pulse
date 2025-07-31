"use client";

import Layout from '@/layout/Layout';

export default function NotFound() {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="text-6xl md:text-8xl font-bold mb-4 text-foreground">404</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="space-y-4">
                        <a
                            href="/"
                            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Return to Home
                        </a>
                        <div className="text-sm text-muted-foreground">
                            <p>Or try one of these pages:</p>
                            <div className="mt-2 space-x-4">
                                <a href="/#about" className="hover:text-primary transition-colors">About</a>
                                <a href="/#projects" className="hover:text-primary transition-colors">Projects</a>
                                <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 