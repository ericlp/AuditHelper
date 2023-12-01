import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { handleFile } from '../handleFile';
import { parseFortnoxAccount } from '../parsers/FortnoxTSVParser';
import { parseSwedbank } from '../parsers/SwedbankCSVParser';
import { AccountingData } from '../types/AccountData';
import { VerificationRow } from '../types/VerificationRow';

interface BankContext {
  bankFile: File | null;
  setBankFile: (bankFiles: File | null) => void;
  accountFiles: File[];
  setAccountFiles: (accountFiles: File[]) => void;
  accountAnalysis: AccountingData | null;
}

const BankContext = createContext<BankContext>({
  bankFile: null,
  accountFiles: [],
  setBankFile: () => [],
  setAccountFiles: () => [],
  accountAnalysis: null,
});

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [accountFiles, setAccountFiles] = useState<File[]>([]);
  const [bankRows, setBankRows] = useState<VerificationRow[] | null>(null);
  const [accountRows, setAccountRows] = useState<VerificationRow[]>([]);

  useEffect(() => {
    handleFile(parseSwedbank, bankFile, data => setBankRows(data));
  }, [bankFile]);

  useEffect(() => {
    const rows: VerificationRow[] = [];
    accountFiles.forEach(file => handleFile(parseFortnoxAccount, file, data => rows.push(...data)));
    setAccountRows(rows);
  }, [accountFiles]);

  const accountAnalysis = useMemo(
    () => (bankRows && accountRows ? new AccountingData(bankRows, accountRows) : null),
    [bankRows, accountRows],
  );

  return (
    <BankContext.Provider
      value={{
        setAccountFiles,
        setBankFile,
        accountFiles,
        bankFile,
        accountAnalysis,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
export const useBank = () => useContext(BankContext);
