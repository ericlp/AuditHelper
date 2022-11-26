import React from 'react';

import { AccountingData } from '../utils/AccountAnalysisTypes';

interface ValidateProps {
  bankAnalysis: AccountingData;
  accountAnalysis: AccountingData;
}

export const Validate: React.FC<ValidateProps> = ({ bankAnalysis, accountAnalysis }) => {
  return (
    <div>
      <h1>Validate</h1>
      <p>Bank Analysis</p>
      <p>Debit Total: {bankAnalysis.debitTotal}</p>
      <p>Credit Total: {bankAnalysis.creditTotal}</p>
      <p>Incoming Saldo: {bankAnalysis.incomingSaldo}</p>
      <p>Outgoing Saldo: {bankAnalysis.outgoingSaldo}</p>
      <p>Account Analysis</p>
      <p>Debit Total: {accountAnalysis.debitTotal}</p>
      <p>Credit Total: {accountAnalysis.creditTotal}</p>
      <p>Incoming Saldo: {accountAnalysis.incomingSaldo}</p>
      <p>Outgoing Saldo: {accountAnalysis.outgoingSaldo}</p>
    </div>
  );
};
