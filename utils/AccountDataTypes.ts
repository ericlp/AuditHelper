import { floatIsSame } from './floatIsSame';
import { stableSort } from './stableSort';

export interface VerificationRow {
  id: number;
  verNr?: string;
  date: Date;
  text: string;
  value: number;
}

export type VerificationRowByDate = Record<string, VerificationRow[]>;

export interface AccountingData {
  creditTotal: number;
  debitTotal: number;
  incomingSaldo: number;
  outgoingSaldo: number;
  verificationsRows: VerificationRow[];
}

export const AccountingDataWithinInterval = (data: AccountingData, start: Date, end: Date) => {
  return data.verificationsRows.filter(row => row.date >= start && row.date <= end);
};

export const AccountingDataCtor = (incomingSaldo: number, verificationsRows: VerificationRow[]): AccountingData => {
  const debitTotal = verificationsRows.reduce((acc, row) => acc + (row.value > 0 ? row.value : 0), 0);
  const creditTotal = verificationsRows.reduce((acc, row) => acc + (row.value < 0 ? row.value : 0), 0);
  const outgoingSaldo = incomingSaldo + debitTotal - creditTotal;

  const sortedRowsValue = stableSort(verificationsRows, (a, b) => a.value - b.value);

  const sortedRowsValueDate = stableSort(sortedRowsValue, (a, b) => a.date.getTime() - b.date.getTime());

  return {
    verificationsRows: sortedRowsValueDate,
    debitTotal,
    incomingSaldo,
    creditTotal,
    outgoingSaldo,
  };
};

export const findCommonDates = (bank: AccountingData, acc: AccountingData) => {
  const bankMaxDate = bank.verificationsRows[bank.verificationsRows.length - 1].date;
  const accMaxDate = acc.verificationsRows[acc.verificationsRows.length - 1].date;
  const smallerMaxDate = bankMaxDate.getTime() < accMaxDate.getTime() ? bankMaxDate : accMaxDate;

  const bankMinDate = bank.verificationsRows[0].date;
  const accMinDate = acc.verificationsRows[0].date;
  const biggerMinDate = bankMinDate.getTime() > accMinDate.getTime() ? bankMinDate : accMinDate;

  return { start: biggerMinDate, end: smallerMaxDate };
};

// exploit the fact that the rows are sorted by value and date
export const groupByDate = (rows: VerificationRow[]) => {
  return rows.reduce((acc: VerificationRowByDate, row) => {
    const date = row.date.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(row);
    return acc;
  }, {});
};

export interface MergedRowsByEquality {
  bank: VerificationRow | null;
  acc: VerificationRow | null;
}

export const getValuesFromMerge = (merge: MergedRowsByEquality): VerificationRow => {
  const item = getItemFromMerge(merge);
  if (!item) {
    throw new Error('No item in merge');
  }
  return item;
};

const getItemFromMerge = (merge: MergedRowsByEquality) => {
  return merge.bank && merge.acc ? merge.bank : merge.bank ? merge.bank : merge.acc ? merge.acc : null;
};

export const happendBefore = (A: MergedRowsByEquality | undefined, B: MergedRowsByEquality | undefined) => {
  if (B === undefined) {
    return true;
  }
  if (A === undefined) {
    return false;
  }

  const a = getValuesFromMerge(A);
  const b = getValuesFromMerge(B);

  if (a.date.getTime() < b.date.getTime()) {
    return true;
  } else if (a.date.getTime() === b.date.getTime()) {
    return a.value <= b.value;
  }
  return false;
};

export const calculatedDiscrepencies = (bank: AccountingData, acc: AccountingData) => {
  const { start, end } = findCommonDates(bank, acc);

  // exploits the fact that the rows are sorted by value and date
  const bankRowsByDate = groupByDate(AccountingDataWithinInterval(bank, start, end));
  const accRowsByDate = groupByDate(AccountingDataWithinInterval(acc, start, end));

  const correctRows: MergedRowsByEquality[] = [];
  const incorrectAccRows: MergedRowsByEquality[] = [];
  const incorrectBankRows: MergedRowsByEquality[] = [];

  Object.keys(bankRowsByDate).forEach(date => {
    const bankRows = bankRowsByDate[date];
    const accRows = accRowsByDate[date];

    bankRows.forEach((bankRow, i) => {
      const accRow = accRows.find(accRow => floatIsSame(accRow.value, bankRow.value));
      if (accRow) {
        correctRows.push({ bank: bankRow, acc: accRow });
        const index = accRows.findIndex(item => accRow.id === item.id);
        if (index !== -1) {
          accRows.splice(index, 1);
        }
      } else {
        incorrectBankRows.push({ bank: bankRow, acc: null });
      }
    });

    accRows.forEach(accRow => {
      incorrectAccRows.push({ bank: null, acc: accRow });
    });
  });

  const bankDates = Object.keys(bankRowsByDate);
  const onlyAccDates = Object.keys(accRowsByDate).filter(date => !bankDates.includes(date));
  onlyAccDates.forEach(date => {
    accRowsByDate[date].forEach(accRow => {
      incorrectAccRows.push({ bank: null, acc: accRow });
    });
  });

  return { correctRows, incorrectAccRows, incorrectBankRows };
};
