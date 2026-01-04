/**
 * Preview/Redirect Page (Dynamic Route)
 * Handles compressed URLs in the path: /d/compressedData
 */

import { Metadata } from 'next';
import LZString from 'lz-string';
import { PreviewCard } from '@/components/PreviewCard';
import { validatePreviewURL } from '@/lib/validation';
import styles from './page.module.css';

// Prevent indexing of preview pages
export const metadata: Metadata = {
  title: 'Link Preview - Permanent QR Code Generator',
  description: 'Preview and verify the destination before visiting',
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: { data: string };
}

export default function PreviewPage({ params }: PageProps) {
  const compressedData = params.data;

  // Check if data exists
  if (!compressedData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Invalid QR Code</h1>
          <p className={styles.errorText}>
            This QR code does not contain a valid URL.
          </p>
          <a href="/" className={styles.homeLink}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Decompress URL
  let decodedUrl: string;
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
    if (!decompressed) {
      throw new Error('Failed to decompress URL');
    }
    decodedUrl = decompressed;
  } catch (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Invalid URL Encoding</h1>
          <p className={styles.errorText}>
            The URL in this QR code is not properly encoded.
          </p>
          <a href="/" className={styles.homeLink}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Validate URL with security checks
  const validation = validatePreviewURL(decodedUrl);
  if (!validation.isValid) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Invalid or Unsafe URL</h1>
          <p className={styles.errorText}>
            {validation.error || 'This URL failed security validation.'}
          </p>
          <details className={styles.details}>
            <summary>Technical Details</summary>
            <p className={styles.detailsText}>URL: {decodedUrl}</p>
          </details>
          <a href="/" className={styles.homeLink}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // URL is valid, show preview card
  return (
    <main className={styles.main}>
      <PreviewCard url={validation.url!} autoRedirect={true} />
    </main>
  );
}
