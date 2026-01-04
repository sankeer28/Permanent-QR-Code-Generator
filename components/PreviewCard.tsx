'use client';

/**
 * Preview Card Component
 * Displays URL preview with countdown and redirect
 */

import React, { useEffect, useState } from 'react';
import { extractDomain } from '@/lib/validation';
import { PREVIEW } from '@/lib/constants';
import styles from './PreviewCard.module.css';

interface PreviewCardProps {
  url: string;
  autoRedirect?: boolean;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  url,
  autoRedirect = true
}) => {
  const [isRedirecting, setIsRedirecting] = useState(true);
  const domain = extractDomain(url);

  useEffect(() => {
    if (!autoRedirect) return;

    // Redirect immediately (with tiny delay to allow render)
    const redirectTimeout = setTimeout(() => {
      window.location.href = url;
    }, 100); // 100ms just to show the page briefly

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [url, autoRedirect]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    window.location.href = url;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Redirecting</h1>

        <div className={styles.urlSection}>
          <p className={styles.label}>Taking you to:</p>
          <p className={styles.domain} title={url}>
            {domain}
          </p>
        </div>

        <div className={styles.spinner} />

        <p className={styles.countdown} aria-live="polite">
          Please wait...
        </p>
      </div>
    </div>
  );
};
