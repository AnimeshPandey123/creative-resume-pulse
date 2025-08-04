import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Layout from '@/layout/Layout';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { fetchBlogPostBySlug, fetchRelatedPosts, blogPosts } from '@/data/mockBlogData';
import { generateBlogPostStructuredData } from '@/config/seo';

export function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const post = await fetchBlogPostBySlug(params.slug);

        if (!post) {
            return {
                title: 'Blog Post Not Found | Animesh Pandey',
                description: 'The requested blog post could not be found.',
            };
        }

        const keywords = [
            ...post.tags.map(tag => tag.name),
            'Animesh Pandey',
            'Blog',
            'Technology',
            'Programming',
            'Web Development'
        ];

        const url = `https://animeshpandey.com/blog/${post.slug}`;

        return {
            title: `${post.title} | Animesh Pandey`,
            description: post.excerpt,
            keywords: keywords,
            authors: [{ name: post.author.name }],
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                url: url,
                images: [
                    {
                        url: post.coverImage,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                authors: [post.author.name],
                publishedTime: post.publishDate,
                tags: post.tags.map(tag => tag.name),
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt,
                images: [post.coverImage],
                creator: '@animeshpandey',
            },
            alternates: {
                canonical: url,
            },
            other: {
                'article:published_time': post.publishDate,
                'article:author': post.author.name,
                'article:section': post.tags.length > 0 ? post.tags[0].name : 'Technology',
                'article:tag': post.tags.map(tag => tag.name).join(', '),
            },
        };
    } catch (error) {
        console.error('Error generating metadata for blog post:', error);
        return {
            title: 'Blog Post | Animesh Pandey',
            description: 'Blog post by Animesh Pandey',
        };
    }
}

// @ts-expect-error Next.js App Router dynamic route params typing
export default async function BlogPostPage({ params }) {
    try {
        const slug = params.slug;
        const post = await fetchBlogPostBySlug(slug);
        const relatedPosts = post ? await fetchRelatedPosts(post.id, 3) : [];

        if (!post) {
            notFound();
        }

        // Generate structured data for the blog post
        const structuredData = generateBlogPostStructuredData({
            title: post.title,
            description: post.excerpt,
            image: post.coverImage,
            publishDate: post.publishDate,
            author: post.author.name,
            url: `https://animeshpandey.com/blog/${post.slug}`,
            tags: post.tags.map(tag => tag.name),
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