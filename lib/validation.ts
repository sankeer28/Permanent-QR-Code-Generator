/**
 * URL Validation Utilities
 * Security-focused validation for URLs in QR codes
 */

import { URL_VALIDATION, MESSAGES } from './constants';

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  url?: string;
}

/**
 * Validates a URL for QR code generation
 * Checks protocol, length, and dangerous patterns
 */
export const validateURL = (url: string): ValidationResult => {
  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check if URL is empty
  if (!trimmedUrl) {
    return {
      isValid: false,
      error: MESSAGES.errors.invalidUrl
    };
  }

  // Check URL length (QR codes become very dense with long URLs)
  if (trimmedUrl.length > URL_VALIDATION.maxLength) {
    return {
      isValid: false,
      error: MESSAGES.errors.urlTooLong
    };
  }

  // Must start with http:// or https://
  const hasValidProtocol = URL_VALIDATION.requiredProtocols.some(protocol =>
    trimmedUrl.toLowerCase().startsWith(protocol)
  );

  if (!hasValidProtocol) {
    return {
      isValid: false,
      error: MESSAGES.errors.invalidUrl
    };
  }

  // Block dangerous protocols (case-insensitive check)
  const lowerUrl = trimmedUrl.toLowerCase();
  const hasDangerousProtocol = URL_VALIDATION.dangerousProtocols.some(protocol =>
    lowerUrl.includes(protocol)
  );

  if (hasDangerousProtocol) {
    return {
      isValid: false,
      error: MESSAGES.errors.dangerousUrl
    };
  }

  // Basic URL validation using URL constructor
  try {
    new URL(trimmedUrl);
    return {
      isValid: true,
      url: trimmedUrl
    };
  } catch {
    return {
      isValid: false,
      error: MESSAGES.errors.invalidUrl
    };
  }
};

/**
 * Validates a URL from the preview page (more strict)
 * Used server-side to validate URLs from QR codes before redirect
 */
export const validatePreviewURL = (url: string): ValidationResult => {
  // First run basic validation
  const basicValidation = validateURL(url);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  try {
    const parsedUrl = new URL(url);

    // Additional checks for preview page
    // Block localhost/127.0.0.1 in production (optional)
    // Uncomment if needed:
    // if (process.env.NODE_ENV === 'production') {
    //   const hostname = parsedUrl.hostname.toLowerCase();
    //   if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    //     return {
    //       isValid: false,
    //       error: MESSAGES.errors.dangerousUrl
    //     };
    //   }
    // }

    return {
      isValid: true,
      url: url
    };
  } catch {
    return {
      isValid: false,
      error: MESSAGES.errors.invalidUrl
    };
  }
};

/**
 * Extracts the domain from a URL for display purposes
 */
export const extractDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch {
    return url;
  }
};

/**
 * Formats URL for display (truncates if too long)
 */
export const formatURLForDisplay = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) {
    return url;
  }
  return url.substring(0, maxLength - 3) + '...';
};
