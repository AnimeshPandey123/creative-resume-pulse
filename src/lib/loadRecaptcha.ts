const RECAPTCHA_SCRIPT_ID = 'recaptcha-api-script';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string | undefined,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

let loadPromise: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    return Promise.reject(new Error('Missing reCAPTCHA site key'));
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load reCAPTCHA')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load reCAPTCHA'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function ensureRecaptchaReady(): Promise<void> {
  return loadRecaptcha().then(
    () =>
      new Promise<void>((resolve, reject) => {
        if (!window.grecaptcha) {
          reject(new Error('reCAPTCHA not available'));
          return;
        }
        window.grecaptcha.ready(() => resolve());
      })
  );
}
