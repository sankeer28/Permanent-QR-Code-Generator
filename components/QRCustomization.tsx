'use client';

/**
 * QR Customization Component
 * Allows users to customize QR code appearance
 */

import React from 'react';
import { QRCodeOptions } from '@/lib/qr';
import styles from './QRCustomization.module.css';

interface QRCustomizationProps {
  options: QRCodeOptions;
  onChange: (options: QRCodeOptions) => void;
}

export const QRCustomization: React.FC<QRCustomizationProps> = ({
  options,
  onChange
}) => {
  const handleColorChange = (field: 'foregroundColor' | 'backgroundColor', value: string) => {
    onChange({ ...options, [field]: value });
  };

  const handleSizeChange = (value: string) => {
    const size = parseInt(value, 10);
    onChange({ ...options, size });
  };

  const handleErrorCorrectionChange = (value: string) => {
    onChange({ ...options, errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H' });
  };

  const handleFormatChange = (value: string) => {
    onChange({ ...options, format: value as 'png' | 'svg' | 'jpeg' });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Customize QR Code</h3>

      <div className={styles.controls}>
        {/* Color Controls - Two Column Layout */}
        <div className={styles.colorGrid}>
          {/* Foreground Color */}
          <div className={styles.control}>
            <label htmlFor="fg-color" className={styles.label}>
              Foreground Color
            </label>
            <div className={styles.colorInput}>
              <input
                type="color"
                id="fg-color"
                value={options.foregroundColor || '#2C3E50'}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={options.foregroundColor || '#2C3E50'}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                className={styles.colorText}
                placeholder="#2C3E50"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className={styles.control}>
            <label htmlFor="bg-color" className={styles.label}>
              Background Color
            </label>
            <div className={styles.colorInput}>
              <input
                type="color"
                id="bg-color"
                value={options.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={options.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className={styles.colorText}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className={styles.control}>
          <label htmlFor="size" className={styles.label}>
            {options.format === 'svg' ? 'Size: Scalable' : `Size: ${options.size || 256}px`}
          </label>
          <input
            type="range"
            id="size"
            min="128"
            max="512"
            step="32"
            value={options.size || 256}
            onChange={(e) => handleSizeChange(e.target.value)}
            className={styles.slider}
            disabled={options.format === 'svg'}
          />
          <div className={styles.sliderLabels}>
            <span>128px</span>
            <span>512px</span>
          </div>
          {options.format === 'svg' && (
            <p className={styles.hint}>SVG files are infinitely scalable</p>
          )}
        </div>

        {/* Error Correction */}
        <div className={styles.control}>
          <label htmlFor="error-correction" className={styles.label}>
            Error Correction
          </label>
          <select
            id="error-correction"
            value={options.errorCorrectionLevel || 'M'}
            onChange={(e) => handleErrorCorrectionChange(e.target.value)}
            className={styles.select}
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
          <p className={styles.hint}>
            Higher error correction allows QR codes to be scanned even if partially damaged
          </p>
        </div>

        {/* Output Format */}
        <div className={styles.control}>
          <label htmlFor="format" className={styles.label}>
            Output Format
          </label>
          <select
            id="format"
            value={options.format || 'png'}
            onChange={(e) => handleFormatChange(e.target.value)}
            className={styles.select}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
            <option value="jpeg">JPEG</option>
          </select>
          <p className={styles.hint}>
            SVG is recommended for transparent backgrounds and infinite scalability
          </p>
        </div>
      </div>
    </div>
  );
};
