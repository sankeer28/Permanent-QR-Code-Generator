/**
 * Root Layout
 * Global layout with metadata and global styles
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Permanent QR Code Generator - Generate QR Codes That Never Expire',
  description: 'Generate QR codes that never expire. Free forever. Your URL is stored in the QR code itself, not on our servers.',
  keywords: ['QR code', 'URL shortener', 'permanent QR code', 'QR generator'],
  authors: [{ name: 'Permanent QR Code Generator' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#F8F9FA',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
