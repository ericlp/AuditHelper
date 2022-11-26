import React, { ChangeEvent } from 'react';

import styles from '../../styles/Home.module.css';
import { AccountingData } from '../../utils/AccountAnalysisTypes';
import { parseFortnox } from '../../utils/FortnoxParser';
import { parseSwedbank } from '../../utils/SwedbankCSVParser';
import { pushToast } from '../Snackbar/Snackbar';

function fileToAccountAnalysis(
  formatter: (input: string) => AccountingData | null,
  file: File | null,
  callback: (str: AccountingData) => void,
) {
  if (file == null) return;
  const reader = new FileReader();
  reader.readAsText(file, 'ISO-8859-4');
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      const result = formatter(reader.result);
      if (result != null) {
        callback(result);
      } else {
        pushToast('Kunde inte läsa filen', 'error');
      }
    }
  };
}

interface UploadFilesProps {
  bankAnalysis: AccountingData | null;
  setBankAnalysis: (str: AccountingData) => void;
  accountingAnalysis: AccountingData | null;
  setAccountingAnalysis: (str: AccountingData) => void;
}

export const UploadFiles: React.FC<UploadFilesProps> = ({ accountingAnalysis, setAccountingAnalysis, bankAnalysis, setBankAnalysis }) => (
  <>
    <h1 className={styles.title}>Welcome to AuditHelper</h1>
    <div className={styles.grid}>
      <UploadField
        complete={bankAnalysis != null}
        onChange={e => fileToAccountAnalysis(parseSwedbank, e.target.files?.item(0) ?? null, setBankAnalysis)}
        name="bank"
        text="Upload bank file"
      />
      <UploadField
        complete={accountingAnalysis != null}
        onChange={e => fileToAccountAnalysis(parseFortnox, e.target.files?.item(0) ?? null, setAccountingAnalysis)}
        name="accounting"
        text="Upload accounting file"
      />
    </div>
  </>
);

interface UploadFieldProps {
  complete: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  text: string;
}

const UploadField: React.FC<UploadFieldProps> = ({ onChange, name, text, complete }) => (
  <>
    <input onChange={onChange} type="file" id={name} hidden />
    <label htmlFor={name} className={styles.card} style={{ borderColor: complete ? 'green' : 'inherit' }}>
      {text}
    </label>
  </>
);
