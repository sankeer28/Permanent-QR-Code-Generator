/**
 * Design System Constants
 * All constants derived from the Swiss precision grid system
 */

// QR Code Generation Settings
export const QR_CONFIG = {
  errorCorrectionLevel: 'M' as const,
  type: 'image/png' as const,
  width: 256,
  margin: 0,
  color: {
    dark: '#2C3E50',  // text-primary
    light: '#FFFFFF'  // white
  }
} as const;

// URL Validation
export const URL_VALIDATION = {
  maxLength: 500,
  requiredProtocols: ['http://', 'https://'],
  dangerousProtocols: ['javascript:', 'data:', 'file:', 'vbscript:']
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000 // 1 minute
} as const;

// Preview Page
export const PREVIEW = {
  redirectDelay: 3000 // 3 seconds in milliseconds
} as const;

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1200
} as const;

// Spacing Scale (8px grid)
export const SPACING = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  8: 64,
  10: 80
} as const;

// Messages
export const MESSAGES = {
  errors: {
    invalidUrl: 'Please enter a valid URL starting with http:// or https://',
    urlTooLong: 'URL exceeds maximum length of 500 characters',
    dangerousUrl: 'This URL contains potentially dangerous content',
    rateLimit: 'Rate limit reached. Please wait a moment.',
    generationFailed: 'Failed to generate QR code. Please try again.'
  },
  success: {
    generated: 'QR code generated successfully',
    downloaded: 'QR code downloaded'
  },
  status: {
    ready: 'Ready',
    generating: 'Generating...',
    generated: 'Generated'
  }
} as const;
