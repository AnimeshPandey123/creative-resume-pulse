import {
  SITE_CONFIG,
  baseMetadata,
  pageMetadata,
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
} from '../seo';

describe('SEO Configuration', () => {
  describe('SITE_CONFIG', () => {
    it('should have all required site configuration properties', () => {
      expect(SITE_CONFIG).toHaveProperty('name');
      expect(SITE_CONFIG).toHaveProperty('title');
      expect(SITE_CONFIG).toHaveProperty('description');
      expect(SITE_CONFIG).toHaveProperty('url');
      expect(SITE_CONFIG).toHaveProperty('ogImage');
      expect(SITE_CONFIG).toHaveProperty('avatarUrl');
      expect(SITE_CONFIG).toHaveProperty('twitterHandle');
      expect(SITE_CONFIG).toHaveProperty('author');
      expect(SITE_CONFIG).toHaveProperty('language');
      expect(SITE_CONFIG).toHaveProperty('locale');
    });

    it('should have correct site URL', () => {
      expect(SITE_CONFIG.url).toBe('https://animeshpandey.com');
    });

    it('should have correct author information', () => {
      expect(SITE_CONFIG.author.name).toBe('Animesh Pandey');
      expect(SITE_CONFIG.author.twitter).toBe('@animeshpandey');
      expect(SITE_CONFIG.author.linkedin).toBe(
        'https://www.linkedin.com/in/animesh-pandey-26546213a'
      );
    });

    it('should have correct language and locale', () => {
      expect(SITE_CONFIG.language).toBe('en');
      expect(SITE_CONFIG.locale).toBe('en_US');
    });
  });

  describe('baseMetadata', () => {
    it('should have all required metadata properties', () => {
      expect(baseMetadata).toHaveProperty('title');
      expect(baseMetadata).toHaveProperty('description');
      expect(baseMetadata).toHaveProperty('keywords');
      expect(baseMetadata).toHaveProperty('authors');
      expect(baseMetadata).toHaveProperty('robots');
      expect(baseMetadata).toHaveProperty('alternates');
      expect(baseMetadata).toHaveProperty('openGraph');
      expect(baseMetadata).toHaveProperty('twitter');
    });

    it('should have correct OpenGraph configuration', () => {
      const openGraph = baseMetadata.openGraph as any;
      expect(openGraph?.type).toBe('website');
      expect(openGraph?.title).toBe(SITE_CONFIG.title);
      expect(openGraph?.description).toBe(SITE_CONFIG.description);
      expect(openGraph?.url).toBe(SITE_CONFIG.url);
      expect(openGraph?.siteName).toBe(`${SITE_CONFIG.name} Portfolio`);
      expect(openGraph?.locale).toBe(SITE_CONFIG.locale);
      expect(openGraph?.images).toHaveLength(1);
      expect(openGraph?.images?.[0]?.url).toBe(SITE_CONFIG.avatarUrl);
    });

    it('should have correct Twitter configuration', () => {
      const twitter = baseMetadata.twitter as any;
      expect(twitter?.card).toBe('summary_large_image');
      expect(twitter?.title).toBe(SITE_CONFIG.title);
      expect(twitter?.description).toBe(SITE_CONFIG.description);
      expect(twitter?.images).toEqual([SITE_CONFIG.avatarUrl]);
      expect(twitter?.creator).toBe(SITE_CONFIG.twitterHandle);
      expect(twitter?.site).toBe(SITE_CONFIG.twitterHandle);
    });
  });

  describe('pageMetadata', () => {
    it('should have all required page metadata', () => {
      expect(pageMetadata).toHaveProperty('home');
      expect(pageMetadata).toHaveProperty('about');
      expect(pageMetadata).toHaveProperty('experience');
      expect(pageMetadata).toHaveProperty('projects');
      expect(pageMetadata).toHaveProperty('skills');
      expect(pageMetadata).toHaveProperty('education');
      expect(pageMetadata).toHaveProperty('contact');
      expect(pageMetadata).toHaveProperty('blog');
      expect(pageMetadata).toHaveProperty('notFound');
    });

    it('should have correct home metadata', () => {
      expect(pageMetadata.home.title).toBe(SITE_CONFIG.title);
      expect(pageMetadata.home.description).toBe(SITE_CONFIG.description);
    });

    it('should have correct blog metadata', () => {
      expect(pageMetadata.blog.title).toContain('Blog');
      expect(pageMetadata.blog.description).toContain(
        'software engineering insights'
      );
    });
  });

  describe('generatePageMetadata', () => {
    it('should generate correct metadata for a page', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
        keywords: ['test', 'page'],
      });

      expect(metadata.title).toBe(`Test Page | ${SITE_CONFIG.name}`);
      expect(metadata.description).toBe('Test description');
      expect(metadata.keywords).toEqual(
        expect.arrayContaining(['test', 'page'])
      );
      expect(metadata.alternates?.canonical).toBe(`${SITE_CONFIG.url}/test`);
    });

    it('should generate correct metadata for homepage', () => {
      const metadata = generatePageMetadata({
        title: 'Home',
        description: 'Home description',
      });

      expect(metadata.title).toBe('Home');
      expect(metadata.alternates?.canonical).toBe(SITE_CONFIG.url);
    });

    it('should use default image when no image provided', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      const openGraph = metadata.openGraph as any;
      const twitter = metadata.twitter as any;
      expect(openGraph?.images?.[0]?.url).toBe(SITE_CONFIG.avatarUrl);
      expect(twitter?.images).toEqual([SITE_CONFIG.avatarUrl]);
    });

    it('should use custom image when provided', () => {
      const customImage = 'https://example.com/custom-image.jpg';
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
        image: customImage,
      });

      const openGraph = metadata.openGraph as any;
      const twitter = metadata.twitter as any;
      expect(openGraph?.images?.[0]?.url).toBe(customImage);
      expect(twitter?.images).toEqual([customImage]);
    });
  });

  describe('generateBlogPostMetadata', () => {
    it('should generate correct blog post metadata', () => {
      const metadata = generateBlogPostMetadata({
        title: 'Test Post',
        description: 'Test post description',
        slug: 'test-post',
        publishedAt: '2024-01-01',
        tags: ['test', 'blog'],
      });

      expect(metadata.title).toBe(`Test Post | ${SITE_CONFIG.name} Blog`);
      expect(metadata.description).toBe('Test post description');
      expect(metadata.keywords).toEqual(
        expect.arrayContaining(['test', 'blog'])
      );
      expect(metadata.alternates?.canonical).toBe(
        `${SITE_CONFIG.url}/blog/test-post`
      );
      const openGraph = metadata.openGraph as any;
      expect(openGraph?.type).toBe('article');
      expect(openGraph?.publishedTime).toBe('2024-01-01');
    });

    it('should handle blog post without tags', () => {
      const metadata = generateBlogPostMetadata({
        title: 'Test Post',
        description: 'Test post description',
        slug: 'test-post',
        publishedAt: '2024-01-01',
      });

      expect(metadata.keywords).toEqual(
        expect.arrayContaining([
          'Software Engineering',
          'Web Development',
          'Programming',
          'Technical Article',
        ])
      );
      expect(metadata.keywords).not.toContain('test');
      expect(metadata.keywords).not.toContain('blog');
    });
  });

  describe('BLOG_CONFIG', () => {
    it('should have correct blog configuration', () => {
      expect(BLOG_CONFIG.baseUrl).toBe(`${SITE_CONFIG.url}/blog`);
      expect(BLOG_CONFIG.postsPerPage).toBe(6);
      expect(BLOG_CONFIG.defaultImage).toBe(SITE_CONFIG.avatarUrl);
      expect(BLOG_CONFIG.author).toBe(SITE_CONFIG.author);
      expect(BLOG_CONFIG.categories).toHaveLength(10);
    });
  });

  describe('Structured Data', () => {
    describe('personStructuredData', () => {
      it('should have correct person structured data', () => {
        expect(personStructuredData['@context']).toBe('https://schema.org');
        expect(personStructuredData['@type']).toBe('Person');
        expect(personStructuredData.name).toBe(SITE_CONFIG.name);
        expect(personStructuredData.jobTitle).toBe('Senior Software Engineer');
        expect(personStructuredData.url).toBe(SITE_CONFIG.url);
        expect(personStructuredData.image).toBe(SITE_CONFIG.avatarUrl);

        const skills = personStructuredData.knowsAbout as string[];
        expect(skills).toContain('PHP');
        expect(skills).toContain('Python');
        expect(skills).toContain('JavaScript');
        expect(skills).toContain('TypeScript');

        const sameAs = personStructuredData.sameAs as string[];
        expect(sameAs).toContain(SITE_CONFIG.author.linkedin);
        expect(sameAs).toContain(SITE_CONFIG.url);
      });
    });

    describe('websiteStructuredData', () => {
      it('should have correct website structured data', () => {
        expect(websiteStructuredData['@context']).toBe('https://schema.org');
        expect(websiteStructuredData['@type']).toBe('WebSite');
        expect(websiteStructuredData.name).toBe(
          `${SITE_CONFIG.name} Portfolio`
        );
        expect(websiteStructuredData.url).toBe(SITE_CONFIG.url);
      });
    });

    describe('organizationStructuredData', () => {
      it('should have correct organization structured data', () => {
        expect(organizationStructuredData['@context']).toBe(
          'https://schema.org'
        );
        expect(organizationStructuredData['@type']).toBe('Organization');
        expect(organizationStructuredData.name).toBe(
          `${SITE_CONFIG.name} Portfolio`
        );
        expect(organizationStructuredData.url).toBe(SITE_CONFIG.url);
        expect(organizationStructuredData.logo).toBe(SITE_CONFIG.avatarUrl);
      });
    });

    describe('portfolioStructuredData', () => {
      it('should have correct portfolio structured data', () => {
        expect(portfolioStructuredData['@context']).toBe('https://schema.org');
        expect(portfolioStructuredData['@type']).toBe('CreativeWork');
        expect(portfolioStructuredData.name).toBe(
          `${SITE_CONFIG.name} Portfolio`
        );
        expect(portfolioStructuredData.description).toContain(
          'software engineering'
        );
      });
    });

    describe('blogStructuredData', () => {
      it('should have correct blog structured data', () => {
        expect(blogStructuredData['@context']).toBe('https://schema.org');
        expect(blogStructuredData['@type']).toBe('Blog');
        expect(blogStructuredData.name).toBe(`${SITE_CONFIG.name} Blog`);
        expect(blogStructuredData.url).toBe(`${SITE_CONFIG.url}/blog`);
      });
    });

    describe('generateBlogPostStructuredData', () => {
      const mockPost = {
        title: 'Test Blog Post',
        description: 'Test blog post description',
        image: 'https://example.com/post-image.jpg',
        publishDate: '2024-01-01',
        author: 'Test Author',
        url: 'https://animeshpandey.com/blog/test-post',
        tags: ['test', 'blog'],
        slug: 'test-post',
      };

      it('should generate correct blog post structured data', () => {
        const structuredData = generateBlogPostStructuredData(mockPost);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('BlogPosting');
        expect(structuredData.headline).toBe(mockPost.title);
        expect(structuredData.image).toBe(mockPost.image);
        expect(structuredData.datePublished).toBe(mockPost.publishDate);
        expect(structuredData.dateModified).toBe(mockPost.publishDate);
        expect(structuredData.author.name).toBe(mockPost.author);
        expect(structuredData.url).toBe(mockPost.url);
        expect(structuredData.identifier).toBe(mockPost.slug);
      });

      it('should use default image when no image provided', () => {
        const postWithoutImage = { ...mockPost, image: undefined };
        const structuredData = generateBlogPostStructuredData(postWithoutImage);

        expect(structuredData.image).toBe(SITE_CONFIG.avatarUrl);
      });

      it('should include tags in keywords', () => {
        const structuredData = generateBlogPostStructuredData(mockPost);

        expect(structuredData.keywords).toBe(mockPost.tags.join(', '));
      });

      it('should handle empty tags array', () => {
        const postWithoutTags = { ...mockPost, tags: [] };
        const structuredData = generateBlogPostStructuredData(postWithoutTags);

        expect(structuredData.articleSection).toBe('Technology');
        expect(structuredData.keywords).toBe('');
      });
    });

    describe('generateBreadcrumbStructuredData', () => {
      it('should generate correct breadcrumb structured data', () => {
        const items = [
          { name: 'Home', url: 'https://animeshpandey.com' },
          { name: 'Blog', url: 'https://animeshpandey.com/blog' },
          { name: 'Post', url: 'https://animeshpandey.com/blog/post' },
        ];

        const structuredData = generateBreadcrumbStructuredData(items);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('BreadcrumbList');
        expect(structuredData.itemListElement).toHaveLength(3);
        expect(structuredData.itemListElement[0].position).toBe(1);
        expect(structuredData.itemListElement[0].name).toBe('Home');
      });
    });

    describe('generateFAQStructuredData', () => {
      it('should generate correct FAQ structured data', () => {
        const faqs = [
          {
            question: 'What is React?',
            answer: 'React is a JavaScript library',
          },
          {
            question: 'What is TypeScript?',
            answer: 'TypeScript is a typed superset of JavaScript',
          },
        ];

        const structuredData = generateFAQStructuredData(faqs);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('FAQPage');
        expect(structuredData.mainEntity).toHaveLength(2);
        expect(structuredData.mainEntity[0]['@type']).toBe('Question');
        expect(structuredData.mainEntity[0].name).toBe('What is React?');
      });
    });

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
        };

        const structuredData = generateProjectStructuredData(project);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('CreativeWork');
        expect(structuredData.name).toBe(project.name);
        expect(structuredData.description).toBe(project.description);
        expect(structuredData.url).toBe(project.url);
        expect(structuredData.genre).toBe('Software Project');
        expect(structuredData.keywords).toBe(project.technologies.join(', '));
      });

      it('should use default image when no image provided', () => {
        const project = {
          name: 'Test Project',
          description: 'A test project description',
          technologies: ['React'],
        };

        const structuredData = generateProjectStructuredData(project);

        expect(structuredData.image).toBe(SITE_CONFIG.ogImage);
      });
    });

    describe('mainStructuredData', () => {
      it('should contain all main structured data types', () => {
        expect(mainStructuredData).toHaveLength(4);
        expect(mainStructuredData).toContain(personStructuredData);
        expect(mainStructuredData).toContain(websiteStructuredData);
        expect(mainStructuredData).toContain(organizationStructuredData);
        expect(mainStructuredData).toContain(portfolioStructuredData);
      });
    });

    describe('blogPageStructuredData', () => {
      it('should contain blog and person structured data', () => {
        expect(blogPageStructuredData).toHaveLength(2);
        expect(blogPageStructuredData).toContain(blogStructuredData);
        expect(blogPageStructuredData).toContain(personStructuredData);
      });
    });
  });

  describe('Legacy exports and default export', () => {
    it('should export legacy generatePortfolioStructuredData function', () => {
      const { generatePortfolioStructuredData } = require('../seo');
      const result = generatePortfolioStructuredData();
      expect(result).toEqual(portfolioStructuredData);
    });

    it('should export default object with all required properties', () => {
      const defaultExport = require('../seo').default;
      expect(defaultExport).toHaveProperty('SITE_CONFIG');
      expect(defaultExport).toHaveProperty('baseMetadata');
      expect(defaultExport).toHaveProperty('pageMetadata');
      expect(defaultExport).toHaveProperty('blogMetadata');
      expect(defaultExport).toHaveProperty('mainStructuredData');
      expect(defaultExport).toHaveProperty('blogPageStructuredData');
      expect(defaultExport).toHaveProperty('BLOG_CONFIG');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle generatePageMetadata with minimal parameters', () => {
      const metadata = generatePageMetadata({
        title: 'Minimal',
        description: 'Minimal description',
      });

      expect(metadata.title).toBe('Minimal');
      expect(metadata.description).toBe('Minimal description');
      expect(metadata.alternates?.canonical).toBe(SITE_CONFIG.url);
    });

    it('should handle generatePageMetadata with article type', () => {
      const metadata = generatePageMetadata({
        title: 'Article',
        description: 'Article description',
        path: '/article',
        type: 'article',
      });

      const openGraph = metadata.openGraph as any;
      expect(openGraph?.type).toBe('article');
    });

    it('should handle generateBlogPostMetadata with minimal parameters', () => {
      const metadata = generateBlogPostMetadata({
        title: 'Minimal Post',
        description: 'Minimal post description',
        slug: 'minimal-post',
        publishedAt: '2024-01-01',
      });

      expect(metadata.title).toBe(`Minimal Post | ${SITE_CONFIG.name} Blog`);
      expect(metadata.description).toBe('Minimal post description');
      expect(metadata.keywords).toEqual(
        expect.arrayContaining([
          'Software Engineering',
          'Web Development',
          'Programming',
          'Technical Article',
        ])
      );
    });

    it('should handle generateBlogPostStructuredData with minimal parameters', () => {
      const minimalPost = {
        title: 'Minimal Post',
        description: 'Minimal description',
        publishDate: '2024-01-01',
        author: 'Test Author',
        url: 'https://animeshpandey.com/blog/minimal',
        tags: [],
        slug: 'minimal',
      };

      const structuredData = generateBlogPostStructuredData(minimalPost);
      expect(structuredData.image).toBe(SITE_CONFIG.avatarUrl);
      expect(structuredData.articleSection).toBe('Technology');
      expect(structuredData.keywords).toBe('');
    });

    it('should handle generateProjectStructuredData with minimal parameters', () => {
      const minimalProject = {
        name: 'Minimal Project',
        description: 'Minimal project description',
        technologies: ['React'],
      };

      const structuredData = generateProjectStructuredData(minimalProject);
      expect(structuredData.image).toBe(SITE_CONFIG.ogImage);
      expect(structuredData.keywords).toBe('React');
    });

    it('should handle generateBreadcrumbStructuredData with single item', () => {
      const singleItem = [{ name: 'Home', url: 'https://animeshpandey.com' }];
      const structuredData = generateBreadcrumbStructuredData(singleItem);

      expect(structuredData.itemListElement).toHaveLength(1);
      expect(structuredData.itemListElement[0].position).toBe(1);
      expect(structuredData.itemListElement[0].name).toBe('Home');
    });

    it('should handle generateFAQStructuredData with single FAQ', () => {
      const singleFAQ = [
        { question: 'What is React?', answer: 'A JavaScript library' },
      ];
      const structuredData = generateFAQStructuredData(singleFAQ);

      expect(structuredData.mainEntity).toHaveLength(1);
      expect(structuredData.mainEntity[0].name).toBe('What is React?');
    });
  });
});
