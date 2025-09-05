// Google Analytics 4 Event Tracking Utilities
// Using @next/third-parties/google for optimized performance

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Custom event tracking functions
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Common event tracking functions
export const trackClick = (elementName: string, location?: string) => {
  trackEvent('click', {
    event_category: 'user_interaction',
    event_label: elementName,
    location: location,
  });
};

export const trackDownload = (fileName: string, fileType?: string) => {
  trackEvent('file_download', {
    event_category: 'engagement',
    event_label: fileName,
    file_type: fileType,
  });
};

export const trackShare = (contentType: string, method: string) => {
  trackEvent('share', {
    event_category: 'social',
    event_label: contentType,
    method: method,
  });
};

export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent('search', {
    event_category: 'engagement',
    event_label: searchTerm,
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Form interaction tracking
export const trackFormSubmit = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    event_category: 'form',
    event_label: formName,
    success: success,
  });
};

// Blog post engagement tracking
export const trackBlogView = (postTitle: string, postSlug: string) => {
  trackEvent('blog_view', {
    event_category: 'content',
    event_label: postTitle,
    post_slug: postSlug,
  });
};

// Contact form tracking
export const trackContactForm = (formType: string, success: boolean = true) => {
  trackEvent('contact_form', {
    event_category: 'engagement',
    event_label: formType,
    success: success,
  });
};
