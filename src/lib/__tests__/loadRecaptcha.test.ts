describe('loadRecaptcha', () => {
  const originalSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key';
    document.head.innerHTML = '';
    delete (window as any).grecaptcha;
    jest.resetModules();
  });

  afterEach(() => {
    if (originalSiteKey === undefined) {
      delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    } else {
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = originalSiteKey;
    }
    document.head.innerHTML = '';
    delete (window as any).grecaptcha;
  });

  it('injects the reCAPTCHA script once', async () => {
    const { loadRecaptcha } = await import('@/lib/loadRecaptcha');
    const promise = loadRecaptcha();
    const script = document.getElementById('recaptcha-api-script') as any;

    expect(script).toBeTruthy();
    expect(script.src).toContain(
      'https://www.google.com/recaptcha/api.js?render=test-site-key'
    );

    script.onload?.({} as any);
    await promise;

    await loadRecaptcha();
    expect(document.querySelectorAll('#recaptcha-api-script')).toHaveLength(1);
  });

  it('waits for grecaptcha.ready before resolving ensureRecaptchaReady', async () => {
    const ready = jest.fn((cb: () => void) => cb());
    (window as any).grecaptcha = {
      ready,
      execute: jest.fn(),
    };

    const { ensureRecaptchaReady } = await import('@/lib/loadRecaptcha');
    await ensureRecaptchaReady();
    expect(ready).toHaveBeenCalled();
  });
});
