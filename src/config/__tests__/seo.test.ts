import { SITE_CONFIG, baseMetadata, generatePageMetadata, pageMetadata, generateBlogPostMetadata } from '@/config/seo'

describe('SEO config', () => {
    it('has base metadata with expected fields', () => {
        expect(baseMetadata.title).toBeTruthy()
        expect(baseMetadata.description).toBeTruthy()
        expect(baseMetadata.openGraph?.type).toBe('website')
        expect(baseMetadata.twitter?.card).toBe('summary_large_image')
    })

    it('generatePageMetadata builds correct canonical and titles', () => {
        const meta = generatePageMetadata({
            title: 'About',
            description: 'desc',
            path: '/about',
            keywords: ['k1'],
        })
        expect(meta.alternates?.canonical).toBe(`${SITE_CONFIG.url}/about`)
        expect(meta.title).toContain('About')
        expect(meta.keywords).toEqual(expect.arrayContaining(['k1']))
    })

    it('pageMetadata exports sections and blog metadata', () => {
        expect(pageMetadata.home).toBeDefined()
        expect(pageMetadata.blog.title).toBeDefined()
    })

    it('generateBlogPostMetadata builds OG and Twitter', () => {
        const meta = generateBlogPostMetadata({
            title: 'Post',
            description: 'D',
            slug: 'post-slug',
            publishedAt: '2024-01-01',
            tags: ['tag1'],
        })
        expect(meta.openGraph?.type).toBe('article')
        expect(meta.alternates?.canonical).toBe(`${SITE_CONFIG.url}/blog/post-slug`)
        expect(meta.keywords).toEqual(expect.arrayContaining(['tag1']))
    })
})

import {
    SITE_CONFIG,
    baseMetadata,
    pageMetadata,
    blogMetadata,
    generatePageMetadata,
    generateBlogPostMetadata,
    generateBlogPostStructuredData,
    generateBreadcrumbStructuredData,
    generateFAQStructuredData,
    generateProjectStructuredData,
    mainStructuredData,
    blogPageStructuredData,
    BLOG_CONFIG,
    personStructuredData,
    websiteStructuredData,
    organizationStructuredData,
    portfolioStructuredData,
    blogStructuredData,
} from '../seo'

describe('SEO Configuration', () => {
    describe('SITE_CONFIG', () => {
        it('should have all required site configuration properties', () => {
            expect(SITE_CONFIG).toHaveProperty('name')
            expect(SITE_CONFIG).toHaveProperty('title')
            expect(SITE_CONFIG).toHaveProperty('description')
            expect(SITE_CONFIG).toHaveProperty('url')
            expect(SITE_CONFIG).toHaveProperty('ogImage')
            expect(SITE_CONFIG).toHaveProperty('twitterHandle')
            expect(SITE_CONFIG).toHaveProperty('author')
            expect(SITE_CONFIG).toHaveProperty('language')
            expect(SITE_CONFIG).toHaveProperty('locale')
        })

        it('should have correct site URL', () => {
            expect(SITE_CONFIG.url).toBe('https://animeshpandey.com')
        })

        it('should have correct author information', () => {
            expect(SITE_CONFIG.author.name).toBe('Animesh Pandey')
            expect(SITE_CONFIG.author.twitter).toBe('@animeshpandey')
            expect(SITE_CONFIG.author.linkedin).toBe('https://www.linkedin.com/in/animesh-pandey-26546213a')
        })

        it('should have correct language and locale', () => {
            expect(SITE_CONFIG.language).toBe('en')
            expect(SITE_CONFIG.locale).toBe('en_US')
        })
    })

    describe('baseMetadata', () => {
        it('should have all required metadata properties', () => {
            expect(baseMetadata).toHaveProperty('title')
            expect(baseMetadata).toHaveProperty('description')
            expect(baseMetadata).toHaveProperty('keywords')
            expect(baseMetadata).toHaveProperty('authors')
            expect(baseMetadata).toHaveProperty('robots')
            expect(baseMetadata).toHaveProperty('alternates')
            expect(baseMetadata).toHaveProperty('openGraph')
            expect(baseMetadata).toHaveProperty('twitter')
            expect(baseMetadata).toHaveProperty('other')
        })

        it('should have correct canonical URL', () => {
            expect(baseMetadata.alternates?.canonical).toBe(SITE_CONFIG.url)
        })

        it('should have correct OpenGraph configuration', () => {
            expect(baseMetadata.openGraph?.type).toBe('website')
            expect(baseMetadata.openGraph?.url).toBe(SITE_CONFIG.url)
            expect(baseMetadata.openGraph?.siteName).toBe(`${SITE_CONFIG.name} Portfolio`)
            expect(baseMetadata.openGraph?.locale).toBe(SITE_CONFIG.locale)
        })

        it('should have correct Twitter configuration', () => {
            expect(baseMetadata.twitter?.card).toBe('summary_large_image')
            expect(baseMetadata.twitter?.creator).toBe(SITE_CONFIG.twitterHandle)
            expect(baseMetadata.twitter?.site).toBe(SITE_CONFIG.twitterHandle)
        })

        it('should have comprehensive keywords', () => {
            const keywords = baseMetadata.keywords as string[]
            expect(keywords).toContain('Animesh Pandey')
            expect(keywords).toContain('Senior Software Engineer')
            expect(keywords).toContain('PHP Developer')
            expect(keywords).toContain('Python Developer')
            expect(keywords).toContain('React Developer')
            expect(keywords.length).toBeGreaterThan(20)
        })

        it('should have correct robots directive', () => {
            expect(baseMetadata.robots).toBe('index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
        })
    })

    describe('pageMetadata', () => {
        it('should have metadata for all predefined pages', () => {
            expect(pageMetadata).toHaveProperty('home')
            expect(pageMetadata).toHaveProperty('about')
            expect(pageMetadata).toHaveProperty('experience')
            expect(pageMetadata).toHaveProperty('projects')
            expect(pageMetadata).toHaveProperty('skills')
            expect(pageMetadata).toHaveProperty('education')
            expect(pageMetadata).toHaveProperty('contact')
            expect(pageMetadata).toHaveProperty('blog')
            expect(pageMetadata).toHaveProperty('notFound')
        })

        it('should have correct canonical URLs for each page', () => {
            expect(pageMetadata.about.alternates?.canonical).toBe(`${SITE_CONFIG.url}/about`)
            expect(pageMetadata.experience.alternates?.canonical).toBe(`${SITE_CONFIG.url}/experience`)
            expect(pageMetadata.projects.alternates?.canonical).toBe(`${SITE_CONFIG.url}/projects`)
            expect(pageMetadata.skills.alternates?.canonical).toBe(`${SITE_CONFIG.url}/skills`)
            expect(pageMetadata.education.alternates?.canonical).toBe(`${SITE_CONFIG.url}/education`)
            expect(pageMetadata.contact.alternates?.canonical).toBe(`${SITE_CONFIG.url}/contact`)
            expect(pageMetadata.blog.alternates?.canonical).toBe(`${SITE_CONFIG.url}/blog`)
            expect(pageMetadata.notFound.alternates?.canonical).toBe(`${SITE_CONFIG.url}/404`)
        })

        it('should have unique titles for each page', () => {
            const titles = Object.values(pageMetadata).map(meta => meta.title)
            const uniqueTitles = new Set(titles)
            expect(uniqueTitles.size).toBe(titles.length)
        })

        it('should have descriptive meta descriptions', () => {
            Object.values(pageMetadata).forEach(meta => {
                expect(meta.description).toBeTruthy()
                expect(meta.description?.length).toBeGreaterThan(50)
                expect(meta.description?.length).toBeLessThan(160)
            })
        })
    })

    describe('blogMetadata', () => {
        it('should have correct blog page metadata', () => {
            expect(blogMetadata.title).toContain('Blog')
            expect(blogMetadata.title).toContain(SITE_CONFIG.name)
            expect(blogMetadata.alternates?.canonical).toBe(`${SITE_CONFIG.url}/blog`)
            expect(blogMetadata.openGraph?.type).toBe('website')
        })

        it('should have blog-specific keywords', () => {
            const keywords = blogMetadata.keywords as string[]
            expect(keywords).toContain('Software Engineering Blog')
            expect(keywords).toContain('Web Development Tutorials')
            expect(keywords).toContain('Technical Articles')
        })
    })

    describe('generatePageMetadata', () => {
        it('should generate metadata with correct canonical URL', () => {
            const metadata = generatePageMetadata({
                title: 'Test Page',
                description: 'Test description',
                path: '/test',
            })

            expect(metadata.alternates?.canonical).toBe(`${SITE_CONFIG.url}/test`)
        })

        it('should generate metadata with correct title format', () => {
            const metadata = generatePageMetadata({
                title: 'Test Page',
                description: 'Test description',
                path: '/test',
            })

            expect(metadata.title).toBe(`Test Page | ${SITE_CONFIG.name}`)
        })

        it('should generate metadata without title suffix for homepage', () => {
            const metadata = generatePageMetadata({
                title: 'Home',
                description: 'Home description',
                path: '',
            })

            expect(metadata.title).toBe('Home')
        })

        it('should include custom keywords', () => {
            const customKeywords = ['custom', 'keywords']
            const metadata = generatePageMetadata({
                title: 'Test Page',
                description: 'Test description',
                keywords: customKeywords,
            })

            const allKeywords = metadata.keywords as string[]
            customKeywords.forEach(keyword => {
                expect(allKeywords).toContain(keyword)
            })
        })

        it('should use custom image when provided', () => {
            const customImage = 'https://example.com/custom-image.jpg'
            const metadata = generatePageMetadata({
                title: 'Test Page',
                description: 'Test description',
                image: customImage,
            })

            expect(metadata.openGraph?.images?.[0]?.url).toBe(customImage)
        })
    })

    describe('generateBlogPostMetadata', () => {
        const mockPost = {
            title: 'Test Blog Post',
            description: 'This is a test blog post description',
            slug: 'test-blog-post',
            publishedAt: '2024-01-01T00:00:00Z',
            tags: ['JavaScript', 'React'],
        }

        it('should generate blog post metadata with correct canonical URL', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.alternates?.canonical).toBe(`${SITE_CONFIG.url}/blog/${mockPost.slug}`)
        })

        it('should generate blog post metadata with correct title format', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.title).toBe(`${mockPost.title} | ${SITE_CONFIG.name} Blog`)
        })

        it('should include blog post tags in keywords', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            const keywords = metadata.keywords as string[]
            mockPost.tags.forEach(tag => {
                expect(keywords).toContain(tag)
            })
        })

        it('should have article type for OpenGraph', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.openGraph?.type).toBe('article')
        })

        it('should include publication date', () => {
            const metadata = generateBlogPostMetadata(mockPost)

            expect(metadata.openGraph?.publishedTime).toBe(mockPost.publishedAt)
        })
    })

    describe('Structured Data', () => {
        describe('personStructuredData', () => {
            it('should have correct person schema structure', () => {
                expect(personStructuredData['@context']).toBe('https://schema.org')
                expect(personStructuredData['@type']).toBe('Person')
                expect(personStructuredData.name).toBe(SITE_CONFIG.name)
                expect(personStructuredData.jobTitle).toBe('Senior Software Engineer')
                expect(personStructuredData.url).toBe(SITE_CONFIG.url)
            })

            it('should have comprehensive skills list', () => {
                const skills = personStructuredData.knowsAbout as string[]
                expect(skills).toContain('PHP')
                expect(skills).toContain('Python')
                expect(skills).toContain('JavaScript')
                expect(skills).toContain('TypeScript')
                expect(skills).toContain('React')
                expect(skills).toContain('Node.js')
            })

            it('should have correct social links', () => {
                const sameAs = personStructuredData.sameAs as string[]
                expect(sameAs).toContain(SITE_CONFIG.author.linkedin)
                expect(sameAs).toContain(SITE_CONFIG.url)
            })
        })

        describe('websiteStructuredData', () => {
            it('should have correct website schema structure', () => {
                expect(websiteStructuredData['@context']).toBe('https://schema.org')
                expect(websiteStructuredData['@type']).toBe('WebSite')
                expect(websiteStructuredData.name).toBe(`${SITE_CONFIG.name} Portfolio`)
                expect(websiteStructuredData.url).toBe(SITE_CONFIG.url)
            })

            it('should have search functionality', () => {
                const potentialAction = websiteStructuredData.potentialAction as any
                expect(potentialAction['@type']).toBe('SearchAction')
                expect(potentialAction.target).toContain(SITE_CONFIG.url)
            })
        })

        describe('organizationStructuredData', () => {
            it('should have correct organization schema structure', () => {
                expect(organizationStructuredData['@context']).toBe('https://schema.org')
                expect(organizationStructuredData['@type']).toBe('Organization')
                expect(organizationStructuredData.name).toBe(`${SITE_CONFIG.name} Portfolio`)
                expect(organizationStructuredData.url).toBe(SITE_CONFIG.url)
            })
        })

        describe('portfolioStructuredData', () => {
            it('should have correct portfolio schema structure', () => {
                expect(portfolioStructuredData['@context']).toBe('https://schema.org')
                expect(portfolioStructuredData['@type']).toBe('CreativeWork')
                expect(portfolioStructuredData.name).toBe(`${SITE_CONFIG.name} Portfolio`)
                expect(portfolioStructuredData.genre).toBe('Portfolio')
            })
        })

        describe('blogStructuredData', () => {
            it('should have correct blog schema structure', () => {
                expect(blogStructuredData['@context']).toBe('https://schema.org')
                expect(blogStructuredData['@type']).toBe('Blog')
                expect(blogStructuredData.name).toBe(`${SITE_CONFIG.name} Blog`)
                expect(blogStructuredData.url).toBe(`${SITE_CONFIG.url}/blog`)
            })
        })

        describe('generateBlogPostStructuredData', () => {
            const mockPost = {
                title: 'Test Blog Post',
                description: 'This is a test blog post description',
                image: 'https://example.com/image.jpg',
                publishDate: '2024-01-01T00:00:00Z',
                author: 'Animesh Pandey',
                url: 'https://animeshpandey.com/blog/test-post',
                tags: ['JavaScript', 'React'],
                slug: 'test-post',
            }

            it('should generate correct blog post structured data', () => {
                const structuredData = generateBlogPostStructuredData(mockPost)

                expect(structuredData['@context']).toBe('https://schema.org')
                expect(structuredData['@type']).toBe('BlogPosting')
                expect(structuredData.headline).toBe(mockPost.title)
                expect(structuredData.datePublished).toBe(mockPost.publishDate)
                expect(structuredData.author.name).toBe(mockPost.author)
                expect(structuredData.url).toBe(mockPost.url)
                expect(structuredData.identifier).toBe(mockPost.slug)
            })

            it('should use default image when no image provided', () => {
                const postWithoutImage = { ...mockPost, image: undefined }
                const structuredData = generateBlogPostStructuredData(postWithoutImage)

                expect(structuredData.image).toBe(SITE_CONFIG.ogImage)
            })

            it('should include tags in keywords', () => {
                const structuredData = generateBlogPostStructuredData(mockPost)

                expect(structuredData.keywords).toBe(mockPost.tags.join(', '))
            })
        })

        describe('generateBreadcrumbStructuredData', () => {
            it('should generate correct breadcrumb structured data', () => {
                const items = [
                    { name: 'Home', url: 'https://animeshpandey.com' },
                    { name: 'Blog', url: 'https://animeshpandey.com/blog' },
                    { name: 'Post', url: 'https://animeshpandey.com/blog/post' },
                ]

                const structuredData = generateBreadcrumbStructuredData(items)

                expect(structuredData['@context']).toBe('https://schema.org')
                expect(structuredData['@type']).toBe('BreadcrumbList')
                expect(structuredData.itemListElement).toHaveLength(3)
                expect(structuredData.itemListElement[0].position).toBe(1)
                expect(structuredData.itemListElement[0].name).toBe('Home')
            })
        })

        describe('generateFAQStructuredData', () => {
            it('should generate correct FAQ structured data', () => {
                const faqs = [
                    { question: 'What is React?', answer: 'React is a JavaScript library' },
                    { question: 'What is TypeScript?', answer: 'TypeScript is a typed superset of JavaScript' },
                ]

                const structuredData = generateFAQStructuredData(faqs)

                expect(structuredData['@context']).toBe('https://schema.org')
                expect(structuredData['@type']).toBe('FAQPage')
                expect(structuredData.mainEntity).toHaveLength(2)
                expect(structuredData.mainEntity[0]['@type']).toBe('Question')
                expect(structuredData.mainEntity[0].name).toBe('What is React?')
            })
        })

        describe('generateProjectStructuredData', () => {
            it('should generate correct project structured data', () => {
                const project = {
                    name: 'Test Project',
                    description: 'A test project description',
                    url: 'https://example.com/project',
                    image: 'https://example.com/project-image.jpg',
                    technologies: ['React', 'TypeScript', 'Node.js'],
                    startDate: '2024-01-01',
                    endDate: '2024-06-01',
                }

                const structuredData = generateProjectStructuredData(project)

                expect(structuredData['@context']).toBe('https://schema.org')
                expect(structuredData['@type']).toBe('CreativeWork')
                expect(structuredData.name).toBe(project.name)
                expect(structuredData.description).toBe(project.description)
                expect(structuredData.url).toBe(project.url)
                expect(structuredData.genre).toBe('Software Project')
                expect(structuredData.keywords).toBe(project.technologies.join(', '))
            })

            it('should use default image when no image provided', () => {
                const project = {
                    name: 'Test Project',
                    description: 'A test project description',
                    technologies: ['React'],
                }

                const structuredData = generateProjectStructuredData(project)

                expect(structuredData.image).toBe(SITE_CONFIG.ogImage)
            })
        })

        describe('mainStructuredData', () => {
            it('should contain all main structured data types', () => {
                expect(mainStructuredData).toHaveLength(4)
                expect(mainStructuredData).toContain(personStructuredData)
                expect(mainStructuredData).toContain(websiteStructuredData)
                expect(mainStructuredData).toContain(organizationStructuredData)
                expect(mainStructuredData).toContain(portfolioStructuredData)
            })
        })

        describe('blogPageStructuredData', () => {
            it('should contain blog and person structured data', () => {
                expect(blogPageStructuredData).toHaveLength(2)
                expect(blogPageStructuredData).toContain(blogStructuredData)
                expect(blogPageStructuredData).toContain(personStructuredData)
            })
        })
    })

    describe('BLOG_CONFIG', () => {
        it('should have all required blog configuration properties', () => {
            expect(BLOG_CONFIG).toHaveProperty('baseUrl')
            expect(BLOG_CONFIG).toHaveProperty('postsPerPage')
            expect(BLOG_CONFIG).toHaveProperty('defaultImage')
            expect(BLOG_CONFIG).toHaveProperty('author')
            expect(BLOG_CONFIG).toHaveProperty('categories')
        })

        it('should have correct blog base URL', () => {
            expect(BLOG_CONFIG.baseUrl).toBe(`${SITE_CONFIG.url}/blog`)
        })

        it('should have reasonable posts per page', () => {
            expect(BLOG_CONFIG.postsPerPage).toBeGreaterThan(0)
            expect(BLOG_CONFIG.postsPerPage).toBeLessThanOrEqual(20)
        })

        it('should have comprehensive blog categories', () => {
            const categories = BLOG_CONFIG.categories
            expect(categories).toContain('Software Engineering')
            expect(categories).toContain('Web Development')
            expect(categories).toContain('Backend Development')
            expect(categories).toContain('Frontend Development')
            expect(categories).toContain('DevOps')
            expect(categories).toContain('Database')
            expect(categories).toContain('API Development')
            expect(categories).toContain('Best Practices')
            expect(categories).toContain('Tutorials')
            expect(categories).toContain('Code Reviews')
        })
    })
})
