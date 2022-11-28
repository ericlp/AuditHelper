import React, { useState } from 'react';

import { FixedTopLeftButton } from '../components/ClearDataButton/ClearDataButton';
import { UploadFiles } from '../components/UploadFields/UploadFields';
import { Validate } from '../components/Validate';
import { AccountingData } from '../utils/AccountDataTypes';

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
      {!moreToUpload && (
        <>
          <FixedTopLeftButton
            onClick={() => {
              setAccountingAnalysis(null);
              setBankAnalysis(null);
            }}
          />
          <Validate bankAnalysis={bankAnalysis} accountAnalysis={accountingAnalysis} />
        </>
      )}
    </>
  );
}
