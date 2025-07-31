import { Suspense } from 'react';
import Layout from '@/layout/Layout';
import BlogPageClient from '@/components/blog/BlogPageClient';

export default function BlogPage() {
    return (
        <Layout>
            <Suspense fallback={
                <section className="pt-24 md:pt-28 pb-12 md:pb-16">
                    <div className="container">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Blog</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Loading blog posts...
                            </p>
                        </div>
                    </div>
                </section>
            }>
                <BlogPageClient />
            </Suspense>
        </Layout>
    );
} 