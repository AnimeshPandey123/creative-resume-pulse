import {
  trackEvent,
  trackClick,
  trackDownload,
  trackShare,
  trackSearch,
  trackPageView,
  trackFormSubmit,
  trackBlogView,
  trackContactForm,
} from '../analytics';

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

// Mock window object
Object.defineProperty(window, 'window', {
  value: window,
  writable: true,
});

describe('Analytics Functions', () => {
  beforeEach(() => {
    mockGtag.mockClear();
    // Ensure window.gtag is available
    (window as any).gtag = mockGtag;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should call gtag with correct parameters when window.gtag is available', () => {
      const eventName = 'test_event';
      const parameters = { test_param: 'test_value' };

      trackEvent(eventName, parameters);

      expect(mockGtag).toHaveBeenCalledWith('event', eventName, parameters);
    });

    it('should not call gtag when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      trackEvent('test_event', { test_param: 'test_value' });

      expect(mockGtag).not.toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('should not call gtag when window.gtag is undefined', () => {
      // @ts-ignore
      window.gtag = undefined;

      trackEvent('test_event', { test_param: 'test_value' });

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should call gtag without parameters when none provided', () => {
      const eventName = 'test_event';

      trackEvent(eventName);

      expect(mockGtag).toHaveBeenCalledWith('event', eventName, undefined);
    });
  });

  describe('trackClick', () => {
    it('should track click events with correct parameters', () => {
      const elementName = 'header_button';
      const location = 'navigation';

      trackClick(elementName, location);

      expect(mockGtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'user_interaction',
        event_label: elementName,
        location: location,
      });
    });

    it('should track click events without location', () => {
      const elementName = 'footer_link';

      trackClick(elementName);

      expect(mockGtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'user_interaction',
        event_label: elementName,
        location: undefined,
      });
    });
  });

  describe('trackDownload', () => {
    it('should track download events with correct parameters', () => {
      const fileName = 'resume.pdf';
      const fileType = 'pdf';

      trackDownload(fileName, fileType);

      expect(mockGtag).toHaveBeenCalledWith('event', 'file_download', {
        event_category: 'engagement',
        event_label: fileName,
        file_type: fileType,
      });
    });

    it('should track download events without file type', () => {
      const fileName = 'portfolio.zip';

      trackDownload(fileName);

      expect(mockGtag).toHaveBeenCalledWith('event', 'file_download', {
        event_category: 'engagement',
        event_label: fileName,
        file_type: undefined,
      });
    });
  });

  describe('trackShare', () => {
    it('should track share events with correct parameters', () => {
      const contentType = 'blog_post';
      const method = 'twitter';

      trackShare(contentType, method);

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', {
        event_category: 'social',
        event_label: contentType,
        method: method,
      });
    });
  });

  describe('trackSearch', () => {
    it('should track search events with correct parameters', () => {
      const searchTerm = 'react tutorial';
      const resultsCount = 15;

      trackSearch(searchTerm, resultsCount);

      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'engagement',
        event_label: searchTerm,
        search_term: searchTerm,
        results_count: resultsCount,
      });
    });

    it('should track search events without results count', () => {
      const searchTerm = 'javascript';

      trackSearch(searchTerm);

      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'engagement',
        event_label: searchTerm,
        search_term: searchTerm,
        results_count: undefined,
      });
    });
  });

  describe('trackPageView', () => {
    const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456';
    });

    afterEach(() => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv;
    });

    it('should track page view with correct parameters when window.gtag is available', () => {
      const pagePath = '/about';
      const pageTitle = 'About Page';

      trackPageView(pagePath, pageTitle);

      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123456', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    });

    it('should track page view without page title', () => {
      const pagePath = '/contact';

      trackPageView(pagePath);

      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123456', {
        page_path: pagePath,
        page_title: undefined,
      });
    });

    it('should not call gtag when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      trackPageView('/test');

      expect(mockGtag).not.toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('should not call gtag when window.gtag is undefined', () => {
      // @ts-ignore
      window.gtag = undefined;

      trackPageView('/test');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should use empty string when GA_MEASUREMENT_ID is not set', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = '';

      trackPageView('/test');

      expect(mockGtag).toHaveBeenCalledWith('config', '', {
        page_path: '/test',
        page_title: undefined,
      });
    });
  });

  describe('trackFormSubmit', () => {
    it('should track successful form submissions', () => {
      const formName = 'contact_form';

      trackFormSubmit(formName, true);

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        event_category: 'form',
        event_label: formName,
        success: true,
      });
    });

    it('should track failed form submissions', () => {
      const formName = 'newsletter_signup';

      trackFormSubmit(formName, false);

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        event_category: 'form',
        event_label: formName,
        success: false,
      });
    });

    it('should default to successful submission', () => {
      const formName = 'contact_form';

      trackFormSubmit(formName);

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        event_category: 'form',
        event_label: formName,
        success: true,
      });
    });
  });

  describe('trackBlogView', () => {
    it('should track blog view events with correct parameters', () => {
      const postTitle = 'Getting Started with React';
      const postSlug = 'getting-started-with-react';

      trackBlogView(postTitle, postSlug);

      expect(mockGtag).toHaveBeenCalledWith('event', 'blog_view', {
        event_category: 'content',
        event_label: postTitle,
        post_slug: postSlug,
      });
    });
  });

  describe('trackContactForm', () => {
    it('should track contact form events with correct parameters', () => {
      const formType = 'general_inquiry';
      const success = true;

      trackContactForm(formType, success);

      expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form', {
        event_category: 'engagement',
        event_label: formType,
        success: success,
      });
    });

    it('should default to successful contact form submission', () => {
      const formType = 'collaboration_request';

      trackContactForm(formType);

      expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form', {
        event_category: 'engagement',
        event_label: formType,
        success: true,
      });
    });
  });
});
