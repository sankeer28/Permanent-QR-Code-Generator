/**
 * Two-Column Layout Component
 * Implements Swiss precision 12-column grid system
 * Responsive: 2 columns on desktop/tablet, stacks on mobile
 */

import React from 'react';
import styles from './TwoColumnLayout.module.css';

interface TwoColumnLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftColumn,
  rightColumn,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          {leftColumn}
        </div>
        <div className={styles.rightColumn}>
          {rightColumn}
        </div>
      </div>
    </div>
  );
};
