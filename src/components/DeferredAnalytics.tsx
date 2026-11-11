'use client';

import React, { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import HotjarAnalytics from '@/components/Hotjar';

const INTERACTION_EVENTS = ['scroll', 'pointerdown', 'keydown'] as const;

export default function DeferredAnalytics() {
  const [enabled, setEnabled] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  useEffect(() => {
    if (enabled) {
      return;
    }

    const enable = () => setEnabled(true);

    INTERACTION_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, enable, {
        once: true,
        passive: true,
      });
    });

    return () => {
      INTERACTION_EVENTS.forEach(eventName => {
        window.removeEventListener(eventName, enable);
      });
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      <HotjarAnalytics />
    </>
  );
}
