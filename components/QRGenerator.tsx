'use client';

/**
 * QR Generator Component
 * Main component that handles QR code generation logic
 * Combines URL input and QR display
 */

import React, { useState } from 'react';
import { URLInput } from './URLInput';
import { QRDisplay } from './QRDisplay';
import { validateURL } from '@/lib/validation';
import { generateQRCode } from '@/lib/qr';
import { MESSAGES } from '@/lib/constants';
import styles from './QRGenerator.module.css';

type Status = 'ready' | 'generating' | 'generated';

export const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [status, setStatus] = useState<Status>('ready');

  const handleGenerate = async () => {
    // Clear previous error
    setError('');

    // Validate URL
    const validation = validateURL(url);
    if (!validation.isValid) {
      setError(validation.error || MESSAGES.errors.invalidUrl);
      return;
    }

    try {
      setStatus('generating');

      // Get base URL (for client-side, use window.location.origin)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

      // Generate QR code
      const dataUrl = await generateQRCode(validation.url!, baseUrl);

      setQrDataUrl(dataUrl);
      setStatus('generated');
    } catch (err) {
      console.error('QR generation error:', err);
      setError(MESSAGES.errors.generationFailed);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    setUrl('');
    setQrDataUrl('');
    setError('');
    setStatus('ready');
  };

  return (
    <div className={styles.container}>
      <URLInput
        value={url}
        onChange={setUrl}
        onSubmit={handleGenerate}
        error={error}
        disabled={status === 'generating'}
      />

      <button
        onClick={handleGenerate}
        disabled={status === 'generating' || !url.trim()}
        className={styles.button}
        aria-label="Generate QR code"
      >
        {status === 'generating' ? 'Generating...' : 'Generate QR Code'}
      </button>

      <div className={styles.status} aria-live="polite" aria-atomic="true">
        <span className={styles.statusLabel}>Status:</span>{' '}
        <span className={`${styles.statusValue} ${styles[`status-${status}`]}`}>
          {status === 'ready' && MESSAGES.status.ready}
          {status === 'generating' && MESSAGES.status.generating}
          {status === 'generated' && MESSAGES.status.generated}
        </span>
      </div>

      {status === 'generated' && qrDataUrl && (
        <div className={styles.actions}>
          <button onClick={handleReset} className={styles.resetButton}>
            Generate Another
          </button>
        </div>
      )}

      {/* Information Sections */}
      <div className={styles.divider} />

      <section className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Why This Is Different</h3>
        <p className={styles.infoText}>
          Traditional QR services store URLs on their servers. When the service shuts down,
          your codes break. This tool embeds the URL directly in the QR code itself.
        </p>
        <p className={styles.infoText}>
          Your QR code works as long as this site exists to decode it.
        </p>
      </section>

      <div className={styles.divider} />

      <section className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Limitations</h3>
        <ul className={styles.infoList}>
          <li>URLs longer than 500 characters create very dense QR codes</li>
          <li>QR codes are physically larger than shortlink services</li>
          <li>No analytics or click tracking (intentional)</li>
        </ul>
      </section>
    </div>
  );
};
