export interface VerificationRow {
  id: number;
  verNr?: number;
  date: Date;
  text: string;
  value: number;
}

export interface VerificationRowByDate {
  date: Date;
  rows: VerificationRow[];
}

export interface AccountingData {
  creditTotal: number;
  debitTotal: number;
  incomingSaldo: number;
  outgoingSaldo: number;
  verificationsRows: VerificationRow[];
}

export const AccountingDataCtor = (incomingSaldo: number, verificationsRows: VerificationRow[]): AccountingData => {
  const debitTotal = verificationsRows.reduce((acc, row) => acc + (row.value > 0 ? row.value : 0), 0);
  const creditTotal = verificationsRows.reduce((acc, row) => acc + (row.value < 0 ? row.value : 0), 0);
  const outgoingSaldo = incomingSaldo + debitTotal - creditTotal;

  verificationsRows.sort((a, b) => a.value - b.value);
  verificationsRows.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    verificationsRows,
    debitTotal,
    incomingSaldo,
    creditTotal,
    outgoingSaldo,
  };
};
