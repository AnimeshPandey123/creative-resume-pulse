import { notFound } from 'next/navigation';
import Layout from '@/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { fetchBlogPostBySlug, fetchRelatedPosts, blogPosts } from '@/data/mockBlogData';

export function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

// @ts-expect-error Next.js App Router dynamic route params typing
export default function BlogPostPage({ params }) {
    const slug = params.slug;
    const post = fetchBlogPostBySlug(slug);
    const relatedPosts = post ? fetchRelatedPosts(post.id, 3) : [];

    if (!post) {
        notFound();
    }

    return (
        <Layout>
            <section className="py-12 md:py-16">
                <div className="container">
                    <BlogPostContent post={post} />
                    <RelatedPosts posts={relatedPosts} />
                </div>
            </section>
        </Layout>
    );
} 