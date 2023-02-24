import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { IssueBox } from '../../components/IssueBox/IssueBox';
import { Numbers } from '../../components/Numbers/Numbers';
import { BankTable } from '../../components/Tables/BankTable';
import { VerificationRowTable } from '../../components/Tables/VerificationRowTable';
import { AccountingDataWithinInterval, findCommonDates } from '../../utils/AccountDataTypes';
import { useAccountingData } from '../../utils/AccountingDataContext';

export const ValidateBankAgainstAccounting: React.FC = () => {
  const { bankAnalysis, accountAnalysis } = useAccountingData();
  const router = useRouter();

  useEffect(() => {
    if (!bankAnalysis || !accountAnalysis) {
      router.push('/');
    }
  }, [bankAnalysis, accountAnalysis, router]);

  if (!bankAnalysis || !accountAnalysis) {
    return <></>;
  }

  const { start, end } = findCommonDates(bankAnalysis, accountAnalysis);

  const rowsAfterLastDateInAccounting = AccountingDataWithinInterval(bankAnalysis, end, undefined);

  return (
    <>
      <IssueBox Issue={<Numbers bank={bankAnalysis} acc={accountAnalysis} />} Title={'Siffror'} />
      <IssueBox Issue={<BankTable bank={bankAnalysis} acc={accountAnalysis} />} Title={'Bank vs Kontoanalys'} />
      <IssueBox
        Issue={<VerificationRowTable rows={rowsAfterLastDateInAccounting.verificationsRows} />}
        Title={'Händelser efter sista bokförda'}
      />
    </>
  );
};

export default ValidateBankAgainstAccounting;
