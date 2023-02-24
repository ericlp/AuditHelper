import React, { useState } from 'react';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './IssueBox.module.css';

interface IssueBoxProps {
  Issue: JSX.Element;
  Title: string;
}

export const IssueBox: React.FC<IssueBoxProps> = ({ Issue, Title }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.issueBox}>
      <div className={styles.issueBoxHeader} onClick={() => setOpen(!open)}>
        <div className={styles.issueBoxTitle}>
          <h2>{Title}</h2>
        </div>
        <FontAwesomeIcon className={styles.issueBoxIcon} icon={open ? faChevronUp : faChevronDown} />
      </div>
      {open && <div className={styles.issueBoxContent}>{Issue}</div>}
    </div>
  );
};
