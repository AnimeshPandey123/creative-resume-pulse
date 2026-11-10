/**
 * @jest-environment node
 */
import { trackEvent, trackPageView } from '../analytics';

describe('analytics without a DOM', () => {
  it('does not call gtag from trackEvent when window is undefined', () => {
    const gtag = jest.fn();
    (global as { gtag?: jest.Mock }).gtag = gtag;

    expect(typeof window).toBe('undefined');

    trackEvent('test_event', { test_param: 'test_value' });

    expect(gtag).not.toHaveBeenCalled();
  });

  it('does not call gtag from trackPageView when window is undefined', () => {
    const gtag = jest.fn();
    (global as { gtag?: jest.Mock }).gtag = gtag;

    trackPageView('/test');

    expect(gtag).not.toHaveBeenCalled();
  });
});
