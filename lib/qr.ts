/**
 * QR Code Generation Utilities
 * Client-side QR code generation using the qrcode library
 */

import QRCode from 'qrcode';
import LZString from 'lz-string';
import { QR_CONFIG } from './constants';

export interface QRCodeOptions {
  foregroundColor?: string;
  backgroundColor?: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  format?: 'png' | 'svg' | 'jpeg';
}

/**
 * Generates a QR code data URL containing the preview page URL
 * @param originalUrl - The original URL to encode
 * @param baseUrl - The base URL of the application (e.g., 'https://example.com')
 * @param options - Customization options for the QR code
 * @returns Promise resolving to a data URL of the QR code image
 */
export const generateQRCode = async (
  originalUrl: string,
  baseUrl: string = '',
  options: QRCodeOptions = {}
): Promise<string> => {
  try {
    // Compress URL using LZ-String for maximum compression
    // This creates much smaller QR codes (50-70% reduction) that are easier to scan
    const compressedUrl = LZString.compressToEncodedURIComponent(originalUrl);

    // Construct the preview URL with compressed data in the path (saves 3 chars vs query param)
    // Format: baseUrl/d/compressedUrl (no ?c= needed)
    const previewUrl = `${baseUrl}/d/${compressedUrl}`;

    const format = options.format || 'png';

    // Merge default config with custom options
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel || QR_CONFIG.errorCorrectionLevel,
      width: options.size || QR_CONFIG.width,
      margin: QR_CONFIG.margin,
      color: {
        dark: options.foregroundColor || QR_CONFIG.color.dark,
        light: options.backgroundColor || QR_CONFIG.color.light
      }
    };

    // Generate QR code based on format
    if (format === 'svg') {
      // For SVG, use toString method
      const svgString = await QRCode.toString(previewUrl, {
        ...qrOptions,
        type: 'svg'
      });
      // Convert SVG to data URL
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
      return svgDataUrl;
    } else {
      // For PNG and JPEG, use toDataURL method with high quality settings
      const imageType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const qrDataUrl = await QRCode.toDataURL(previewUrl, {
        ...qrOptions,
        type: imageType,
        rendererOpts: {
          quality: 1.0 // Maximum quality for JPEG
        },
        scale: 10 // Higher scale for sharper images (default is 4)
      });
      return qrDataUrl;
    }
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Downloads a QR code image
 * @param dataUrl - The data URL of the QR code image
 * @param format - The format of the file (png, svg, jpeg)
 */
export const downloadQRCode = (
  dataUrl: string,
  format: 'png' | 'svg' | 'jpeg' = 'png'
): void => {
  try {
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `qr-code-${timestamp}.${format}`;

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error('QR code download failed:', error);
    throw new Error('Failed to download QR code');
  }
};

/**
 * Validates QR code generation is possible (checks library availability)
 * @returns boolean indicating if QR generation is available
 */
export const isQRGenerationAvailable = (): boolean => {
  return typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function';
};

/**
 * Estimates the complexity of a QR code based on URL length
 * Returns a human-readable description
 * @param url - The URL to encode
 * @returns Description of QR code complexity
 */
export const estimateQRComplexity = (url: string): {
  level: 'low' | 'medium' | 'high';
  description: string;
} => {
  const length = url.length;

  if (length < 100) {
    return {
      level: 'low',
      description: 'QR code will be easy to scan'
    };
  } else if (length < 300) {
    return {
      level: 'medium',
      description: 'QR code will be moderately dense'
    };
  } else {
    return {
      level: 'high',
      description: 'QR code will be very dense and may be difficult to scan'
    };
  }
};
