'use client';

/**
 * Main Generator Page
 * Two-column layout with QR generation on left, display on right
 */

import React, { useState } from 'react';
import { TwoColumnLayout } from '@/components/TwoColumnLayout';
import { QRDisplay } from '@/components/QRDisplay';
import { QRCustomization } from '@/components/QRCustomization';
import { URLInput } from '@/components/URLInput';
import { validateURL } from '@/lib/validation';
import { generateQRCode, QRCodeOptions } from '@/lib/qr';
import { MESSAGES } from '@/lib/constants';
import styles from './page.module.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    foregroundColor: '#2C3E50',
    backgroundColor: '#FFFFFF',
    size: 256,
    errorCorrectionLevel: 'M',
    format: 'png'
  });

  const handleGenerate = async () => {
    setError('');

    const validation = validateURL(url);
    if (!validation.isValid) {
      setError(validation.error || MESSAGES.errors.invalidUrl);
      return;
    }

    try {
      setIsGenerating(true);
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = await generateQRCode(validation.url!, baseUrl, qrOptions);
      setQrDataUrl(dataUrl);
      setIsGenerating(false);
    } catch (err) {
      console.error('QR generation error:', err);
      setError(MESSAGES.errors.generationFailed);
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setQrDataUrl(null);
    setError('');
  };

  // Left column content
  const leftColumn = (
    <div className={styles.leftColumn}>
      <URLInput
        value={url}
        onChange={setUrl}
        onSubmit={handleGenerate}
        error={error}
        disabled={isGenerating}
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !url.trim()}
        className={styles.button}
        aria-label="Generate QR code"
      >
        {isGenerating ? 'Generating...' : 'Generate QR Code'}
      </button>

      {qrDataUrl && (
        <button onClick={handleReset} className={styles.resetButton}>
          Generate Another
        </button>
      )}

      <div className={styles.divider} />

      <QRCustomization options={qrOptions} onChange={setQrOptions} />

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
    </div>
  );

  // Right column content
  const rightColumn = (
    <QRDisplay qrDataUrl={qrDataUrl} isGenerating={isGenerating} options={qrOptions} />
  );

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <svg
            className={styles.titleIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <rect width="100" height="100" fill="currentColor" rx="8"/>
            <rect x="10" y="10" width="30" height="30" fill="white" rx="2"/>
            <rect x="15" y="15" width="20" height="20" fill="currentColor" rx="1"/>
            <rect x="20" y="20" width="10" height="10" fill="white"/>
            <rect x="60" y="10" width="30" height="30" fill="white" rx="2"/>
            <rect x="65" y="15" width="20" height="20" fill="currentColor" rx="1"/>
            <rect x="70" y="20" width="10" height="10" fill="white"/>
            <rect x="10" y="60" width="30" height="30" fill="white" rx="2"/>
            <rect x="15" y="65" width="20" height="20" fill="currentColor" rx="1"/>
            <rect x="20" y="70" width="10" height="10" fill="white"/>
            <rect x="50" y="50" width="8" height="8" fill="white" rx="1"/>
            <rect x="62" y="50" width="8" height="8" fill="white" rx="1"/>
            <rect x="74" y="50" width="8" height="8" fill="white" rx="1"/>
            <rect x="50" y="62" width="8" height="8" fill="white" rx="1"/>
            <rect x="62" y="62" width="8" height="8" fill="white" rx="1"/>
            <rect x="74" y="62" width="8" height="8" fill="white" rx="1"/>
            <rect x="50" y="74" width="8" height="8" fill="white" rx="1"/>
            <rect x="62" y="74" width="8" height="8" fill="white" rx="1"/>
            <rect x="74" y="74" width="8" height="8" fill="white" rx="1"/>
          </svg>
          Permanent QR Code Generator
        </h1>
        <p className={styles.tagline}>
          Generate QR codes that never expire. Free forever. Your URL is stored in the QR itself.
        </p>
      </header>

      <TwoColumnLayout leftColumn={leftColumn} rightColumn={rightColumn} />
    </main>
  );
}
