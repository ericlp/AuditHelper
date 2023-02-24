import React, { useState } from 'react';

import Link from 'next/link';

import { UploadFiles } from '../components/UploadFields/UploadFields';
import gStyles from '../styles/globals.module.css';
import { useAccountingData } from '../utils/AccountingDataContext';

import styles from './index.module.css';

export default function Home() {
  const { accountAnalysis, bankAnalysis, setAccountAnalysis, setBankAnalysis } = useAccountingData();

  const moreToUpload = accountAnalysis == null || bankAnalysis == null;
  return (
    <>
      <UploadFiles
        accountingAnalysis={accountAnalysis}
        bankAnalysis={bankAnalysis}
        setAccountingAnalysis={setAccountAnalysis}
        setBankAnalysis={setBankAnalysis}
      />

      {!moreToUpload && (
        <div className={styles.centerItemContainer}>
          <Link href={'/analysis'}>
            <button className={`${gStyles.card}`}>
              <span>Analysera rapporter</span>
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
