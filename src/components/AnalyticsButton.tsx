'use client';

import React from 'react';
import { trackClick } from '@/lib/analytics';

interface AnalyticsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementName: string;
  location?: string;
  as?: 'button' | 'a';
  href?: string;
  children: React.ReactNode;
}

/**
 * A button component that automatically tracks click events
 * Can render as either a button or anchor element
 */
export default function AnalyticsButton({
  elementName,
  location,
  as = 'button',
  href,
  onClick,
  children,
  ...props
}: AnalyticsButtonProps) {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    // Track the click event
    trackClick(elementName, location);

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(event as any);
    }
  };

  if (as === 'a') {
    return (
      <a
        href={href}
        onClick={handleClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
