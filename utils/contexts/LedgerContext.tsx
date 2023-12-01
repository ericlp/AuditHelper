import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { handleFile } from '../handleFile';
import { Ledger, parseFortnoxLedger } from '../parsers/FortnoxTSVParser';

interface LedgerContext {
  ledgerFiles: File[];
  setLedgerFiles: (accountFiles: File[]) => void;
  ledgerAnalysis: Ledger | null;
}

const LedgerContext = createContext<LedgerContext>({
  ledgerFiles: [],
  setLedgerFiles: () => [],
  ledgerAnalysis: null,
});

export const LedgerProvider = ({ children }: { children: React.ReactNode }) => {
  const [ledgerFiles, setLedgerFiles] = useState<File[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  useEffect(() => {
    setLedgers([]);
    const ledger: Ledger[] = [];
    ledgerFiles.forEach(file => handleFile<Ledger>(parseFortnoxLedger, file, data => ledger.push(data)));
  }, [ledgerFiles]);

  const ledgerAnalysis = useMemo(
    () =>
      ledgers.reduce(ledger => {
        Object.entries(ledger).forEach(([key, value]) => {
          if (ledger[key] === undefined) {
            ledger[key] = value;
          } else {
            const a = ledger[key];
            a.combine(value);
          }
        });
        return ledger;
      }, {}),
    [ledgers],
  );

  return (
    <LedgerContext.Provider
      value={{
        ledgerAnalysis,
        ledgerFiles,
        setLedgerFiles,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};
export const useBank = () => useContext(LedgerContext);
