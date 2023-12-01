import React, { useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';

import { ComparisonTable } from '../../components/Tables/ComparisonTable';
import { useBank } from '../../utils/contexts/BankContext';
import { AccountingDataWithinInterval, findCommonDates, findDifferences } from '../../utils/types/AccountDataTypes';

import styles from './index.module.css';

export const ValidateBankAgainstAccounting: React.FC = () => {
  const { bankRows, accountRows } = useBank();
  const router = useRouter();

  useEffect(() => {
    if (!bankRows || !accountRows) {
      router.push('/');
    }
  }, [bankRows, accountRows, router]);

  const rows = useMemo(() => findDifferences(bankRows, accountRows), [bankRows, accountRows]);

  if (!bankRows || !accountRows) {
    return <></>;
  }

  const { start, end } = findCommonDates(bankRows, accountRows);

  const newBank = AccountingDataWithinInterval(bankRows, start, end);
  const newAcc = AccountingDataWithinInterval(accountRows, start, end);

  const diffIncoming = newBank.incomingSaldo - newAcc.incomingSaldo;
  const diffOutgoing = newBank.outgoingSaldo - newAcc.outgoingSaldo;
  const diffTotal = diffIncoming - diffOutgoing;

  return (
    <>
      <div className={styles.flexColumnCenter}>
        <p> Skillander: Bank - Kontoanalys </p>
        <p> {`Inkommande: ${diffIncoming.toFixed(2).toLocaleString()}`} </p>
        <p> {`Omslutning: ${diffTotal.toFixed(2).toLocaleString()}`} </p>
        <p> {`Utgående: ${diffOutgoing.toFixed(2).toLocaleString()}`} </p>
      </div>
      <ComparisonTable rows={rows} />
    </>
  );
};

export default ValidateBankAgainstAccounting;
