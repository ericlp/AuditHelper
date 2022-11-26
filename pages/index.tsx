import React, { useState } from 'react';

import { UploadFiles } from '../components/UploadFields/UploadFields';
import { Validate } from '../components/Validate';
import { AccountingData } from '../utils/AccountAnalysisTypes';

export default function Home() {
  const [accountingAnalysis, setAccountingAnalysis] = useState<AccountingData | null>(null);
  const [bankAnalysis, setBankAnalysis] = useState<AccountingData | null>(null);

  const moreToUpload = accountingAnalysis == null || bankAnalysis == null;
  return (
    <>
      {moreToUpload && (
        <UploadFiles
          accountingAnalysis={accountingAnalysis}
          bankAnalysis={bankAnalysis}
          setAccountingAnalysis={setAccountingAnalysis}
          setBankAnalysis={setBankAnalysis}
        />
      )}
      {!moreToUpload && <Validate bankAnalysis={bankAnalysis} accountAnalysis={accountingAnalysis} />}
    </>
  );
}
