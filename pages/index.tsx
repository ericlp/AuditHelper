import React, { ChangeEvent, useState } from 'react';

import { IconDefinition, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import gStyles from '../styles/globals.module.css';
import { useBank } from '../utils/contexts/BankContext';
import { AccountingData } from '../utils/types/AccountDataTypes';

import styles from './index.module.css';

export default function Home() {
  const { bankFile, setBankFile, accountFiles, setAccountFiles, bankRows, accountRows } = useBank();

  const [ledgerFiles, setLedgerFiles] = useState<File[]>([]);
  const [ledgerAnalysis, setLedgerAnalysis] = useState<AccountingData | null>(null);

  const handleBankUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    let newBankfile = null;
    const newAccountFiles: File[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files.item(i);
      if (file && file.name.endsWith('.csv')) {
        newBankfile = file;
      } else if (file && file.name.endsWith('.txt')) {
        newAccountFiles.push(file);
      }
    }
    if (newBankfile != null) setBankFile(newBankfile);
    if (newAccountFiles.length > 0)
      setAccountFiles([...accountFiles.filter(file => newAccountFiles.some(newFile => newFile.name !== file.name)), ...newAccountFiles]);
  };

  const alluploadedBank = bankRows != null && accountRows != null;

  const renderUploadedFile = (file: File, onRemove: () => void) => (
    <div className={styles.flexRowCenter}>
      <div className={styles.flexColumnCenter}>
        <div className={styles.uploadedFile}>{file.name}</div>
      </div>
      <div className={styles.flexColumnCenter}>
        <button onClick={onRemove} className={styles.removeButton}>
          <FontAwesomeIcon icon={faTimes as IconDefinition} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.flexRowCenter}>
        <div className={styles.flexColumnCenter}>
          <input onChange={handleBankUpload} type="file" id={'bank'} hidden multiple />
          <label htmlFor={'bank'} className={gStyles.card} style={{ borderColor: alluploadedBank ? 'green' : 'inherit' }}>
            Transaktionlista (CSV) & KontoAnalys (TXT)
          </label>
          {bankFile && renderUploadedFile(bankFile, () => setBankFile(null))}
          {accountFiles.map((file, i) => (
            <React.Fragment key={i}>
              {renderUploadedFile(file, () => setAccountFiles(accountFiles.filter((_, j) => i !== j)))}
            </React.Fragment>
          ))}
        </div>
        {alluploadedBank && (
          <Link href={'/analysis'} className={styles.iconButton}>
            <span>Analysera banken</span>
            <FontAwesomeIcon style={{ fontSize: 14 }} icon={faArrowRight as IconDefinition} />
          </Link>
        )}
      </div>
    </>
  );
}
