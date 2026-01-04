/**
 * Preview/Redirect Page
 * Displays URL preview with security validation and auto-redirect
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
  searchParams: { url?: string; d?: string; c?: string };
}

export default function PreviewPage({ searchParams }: PageProps) {
  const compressedUrl = searchParams.c;
  const base64Url = searchParams.d;
  const urlEncodedUrl = searchParams.url;

  // Check if any parameter exists
  if (!compressedUrl && !base64Url && !urlEncodedUrl) {
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

  // Decode URL (supports multiple formats for backwards compatibility)
  let decodedUrl: string;
  try {
    if (compressedUrl) {
      // New format: LZ-String compressed (smallest QR codes)
      const decompressed = LZString.decompressFromEncodedURIComponent(compressedUrl);
      if (!decompressed) {
        throw new Error('Failed to decompress URL');
      }
      decodedUrl = decompressed;
    } else if (base64Url) {
      // Old format: base64 encoded
      decodedUrl = atob(base64Url);
    } else if (urlEncodedUrl) {
      // Oldest format: URL encoded (for backwards compatibility)
      decodedUrl = decodeURIComponent(urlEncodedUrl);
    } else {
      throw new Error('No valid URL parameter');
    }
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
