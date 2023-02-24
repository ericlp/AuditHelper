import React from 'react';

import { AccountingData, AccountingDataWithinInterval, findCommonDates } from '../../utils/AccountDataTypes';

interface NumbersProps {
  bank: AccountingData;
  acc: AccountingData;
}

export const Numbers: React.FC<NumbersProps> = ({ bank, acc }) => {
  const { start, end } = findCommonDates(bank, acc);

  const newBank = AccountingDataWithinInterval(bank, start, end);
  const newAcc = AccountingDataWithinInterval(acc, start, end);

  const diffIncoming = newBank.incomingSaldo - newAcc.incomingSaldo;

  const diffTotal = newBank.debitTotal - newBank.creditTotal - newAcc.debitTotal + newAcc.creditTotal;
  const diffOutgoing = newBank.outgoingSaldo - newAcc.outgoingSaldo;

  return (
    <div>
      <p> Skillander: Bank - Kontoanalys </p>
      <p> {`Inkommande: ${diffIncoming.toFixed(2)}`} </p>
      <p> {`Omslutning: ${diffTotal.toFixed(2)}`} </p>
      <p> {`Utgående: ${diffOutgoing.toFixed(2)}`} </p>
    </div>
  );
};
