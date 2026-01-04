'use client';

/**
 * QR Display Component
 * Displays generated QR code and provides download functionality
 */

import React from 'react';
import { downloadQRCode, QRCodeOptions } from '@/lib/qr';
import { MESSAGES } from '@/lib/constants';
import styles from './QRDisplay.module.css';

interface QRDisplayProps {
  qrDataUrl: string | null;
  isGenerating?: boolean;
  options?: QRCodeOptions;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  qrDataUrl,
  isGenerating = false,
  options = {}
}) => {
  const errorCorrectionLevels = {
    'L': 'Low (7%)',
    'M': 'Medium (15%)',
    'Q': 'Quartile (25%)',
    'H': 'High (30%)'
  };

  const formatLabels = {
    'png': 'PNG',
    'svg': 'SVG',
    'jpeg': 'JPEG'
  };
  const handleDownload = () => {
    if (!qrDataUrl) return;

    try {
      const format = options.format || 'png';
      downloadQRCode(qrDataUrl, format);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {/* QR Code Display Area */}
      <div className={styles.qrContainer}>
        {isGenerating ? (
          <div className={styles.placeholder}>
            <div className={styles.spinner} />
            <p className={styles.placeholderText}>Generating QR code...</p>
          </div>
        ) : qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Generated QR code"
            className={styles.qrImage}
            width={256}
            height={256}
          />
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.placeholderText}>QR code will appear here</p>
          </div>
        )}
      </div>

      {/* Download Button - only show when QR code is generated */}
      {qrDataUrl && !isGenerating && (
        <button
          onClick={handleDownload}
          className={styles.downloadButton}
          aria-label="Download QR code as PNG"
        >
          Download QR Code
        </button>
      )}

      {/* Divider */}
      <div className={styles.divider} />

      {/* Technical Details Section */}
      <section className={styles.detailsSection}>
        <h3 className={styles.detailsTitle}>Technical Details</h3>
        <ul className={styles.detailsList}>
          <li>
            <span className={styles.detailLabel}>Error Correction:</span>
            <span className={styles.detailValue}>
              {errorCorrectionLevels[options.errorCorrectionLevel || 'M']}
            </span>
          </li>
          <li>
            <span className={styles.detailLabel}>Format:</span>
            <span className={styles.detailValue}>{formatLabels[options.format || 'png']}</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Size:</span>
            <span className={styles.detailValue}>
              {options.format === 'svg'
                ? 'Scalable (Vector)'
                : `${options.size || 256}×${options.size || 256} pixels`}
            </span>
          </li>
          <li>
            <span className={styles.detailLabel}>No expiration</span>
          </li>
          <li>
            <span className={styles.detailLabel}>No tracking</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
