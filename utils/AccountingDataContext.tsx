import React, { createContext, useContext, useState } from 'react';

import { AccountingData } from './AccountDataTypes';

interface AccountingDataContext {
  bankAnalysis: AccountingData | null;
  accountAnalysis: AccountingData | null;
  setBankAnalysis: (bankAnalysis: AccountingData) => void;
  setAccountAnalysis: (accountAnalysis: AccountingData) => void;
}

const AccountingDataContext = createContext<AccountingDataContext>({
  bankAnalysis: null,
  accountAnalysis: null,
  setBankAnalysis: () => {
    console.log('setBankAnalysis');
  },
  setAccountAnalysis: () => {
    console.log('setAccountAnalysis');
  },
});

export const AccountingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bankAnalysis, setBankAnalysis] = useState<AccountingData | null>(null);
  const [accountAnalysis, setAccountAnalysis] = useState<AccountingData | null>(null);

  return (
    <AccountingDataContext.Provider
      value={{
        bankAnalysis,
        accountAnalysis,
        setBankAnalysis,
        setAccountAnalysis,
      }}
    >
      {children}
    </AccountingDataContext.Provider>
  );
};
export const useAccountingData = () => useContext(AccountingDataContext);
