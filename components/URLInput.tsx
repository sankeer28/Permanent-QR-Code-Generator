'use client';

/**
 * URL Input Component
 * Input field with validation and error states
 */

import React, { ChangeEvent } from 'react';
import styles from './URLInput.module.css';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const URLInput: React.FC<URLInputProps> = ({
  value,
  onChange,
  onSubmit,
  error,
  disabled = false,
  placeholder = 'https://example.com'
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="url-input" className={styles.label}>
        Enter URL
      </label>
      <input
        id="url-input"
        type="url"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'url-error' : undefined}
        autoComplete="url"
        spellCheck="false"
      />
      {error && (
        <p id="url-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
