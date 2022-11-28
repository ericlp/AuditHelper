import React from 'react';

import { AccountingData, AccountingDataWithinInterval, calculatedDiscrepencies, findCommonDates } from '../utils/AccountDataTypes';

import { AccountingDataTable } from './AccountingDataTable/AccountingDataTable';
import { DiscrepenciesTable } from './DiscrepenciesTable/DiscrepenciesTable';

interface ValidateProps {
  bankAnalysis: AccountingData;
  accountAnalysis: AccountingData;
}

export const Validate: React.FC<ValidateProps> = ({ bankAnalysis, accountAnalysis }) => {
  const { start, end } = findCommonDates(bankAnalysis, accountAnalysis);

  const bankRows = AccountingDataWithinInterval(bankAnalysis, start, end);
  const accRows = AccountingDataWithinInterval(accountAnalysis, start, end);

  return (
    <>
      <DiscrepenciesTable bank={bankAnalysis} acc={accountAnalysis} />
    </>
  );
};
