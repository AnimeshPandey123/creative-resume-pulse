import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Layout from '@/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { fetchBlogPostBySlug, fetchRelatedPosts, blogPosts } from '@/data/mockBlogData';
import { generateBlogPostMetadata, generateBlogPostStructuredData } from '@/config/seo';

export function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const post = await fetchBlogPostBySlug(slug);

        if (!post) {
            return {
                title: 'Blog Post Not Found | Animesh Pandey',
                description: 'The requested blog post could not be found.',
            };
        }

        // Use the centralized metadata generation function
        return generateBlogPostMetadata({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            publishedAt: post.publishDate,
            tags: post.tags.map(tag => tag.name),
        });
    } catch (error) {
        console.error('Error generating metadata for blog post:', error);
        return {
            title: 'Blog Post | Animesh Pandey',
            description: 'Blog post by Animesh Pandey',
        };
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const post = await fetchBlogPostBySlug(slug);
        const relatedPosts = post ? await fetchRelatedPosts(post.id, 3) : [];

        if (!post) {
            notFound();
        }

        // Generate structured data for the blog post using centralized function
        const structuredData = generateBlogPostStructuredData({
            title: post.title,
            description: post.excerpt,
            image: post.coverImage,
            publishDate: post.publishDate,
            author: post.author.name,
            url: `https://animeshpandey.com/blog/${post.slug}`,
            tags: post.tags.map(tag => tag.name),
            slug: post.slug,
        });

        return (
            <Layout>
                <section className="py-12 md:py-16">
                    <div className="container">
                        <BlogPostContent post={post} />
                        <RelatedPosts posts={relatedPosts} />
                    </div>
                </section>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </Layout>
        );
    } catch (error) {
        console.error('Error rendering blog post:', error);
        notFound();
    }
} 