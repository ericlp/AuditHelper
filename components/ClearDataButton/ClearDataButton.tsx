import React from 'react';

import homeStyles from '../../styles/Home.module.css';

import styles from './ClearDataButton.module.css';

interface ClearDataButtonProps {
  onClick: () => void;
}

export const FixedTopLeftButton: React.FC<ClearDataButtonProps> = ({ onClick }) => (
  <button className={`${styles.clearDataButton} ${homeStyles.card}`} onClick={onClick}>
    <span> Clear data</span>
  </button>
);
