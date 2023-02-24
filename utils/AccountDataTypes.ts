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

export interface CombinedRows {
  bank: VerificationRow[];
  acc: VerificationRow[];
}

export const AccountingDataWithinInterval = (data: AccountingData, start?: Date, end?: Date) => {
  const rows = data.verificationsRows.filter(row => (start != null ? row.date >= start : true) && (end != null ? row.date <= end : true));
  const earlyRows = start == null ? [] : data.verificationsRows.filter(row => row.date < start);
  const sumEarlyRows = earlyRows.reduce((acc, row) => acc + row.value, 0);
  return AccountingDataCtor(sumEarlyRows + data.incomingSaldo, rows);
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

export const calculatedDiscrepencies = (bank: AccountingData, acc: AccountingData) => {
  const { start, end } = findCommonDates(bank, acc);
  const bankRowsByDate = groupByDate(AccountingDataWithinInterval(bank, start, end).verificationsRows);
  const accRowsByDate = groupByDate(AccountingDataWithinInterval(acc, start, end).verificationsRows);
  const correctRows: CombinedRows[] = [];
  const incorrectAccRows: VerificationRow[] = [];
  const incorrectBankRows: VerificationRow[] = [];

  Object.keys(bankRowsByDate).forEach(date => {
    const bankRows = bankRowsByDate[date];
    const accRows = accRowsByDate[date] ?? [];

    bankRows.forEach(bankRow => {
      const accRow = accRows.find(accRow => floatIsSame(accRow.value, bankRow.value));
      if (accRow) {
        correctRows.push({ bank: [bankRow], acc: [accRow] });
        const index = accRows.findIndex(item => accRow.id === item.id);
        if (index !== -1) {
          accRows.splice(index, 1);
        }
      } else {
        incorrectBankRows.push(bankRow);
      }
    });

    accRows.forEach(accRow => {
      incorrectAccRows.push(accRow);
    });
  });

  const bankDates = Object.keys(bankRowsByDate);
  const onlyAccDates = Object.keys(accRowsByDate).filter(date => !bankDates.includes(date));
  onlyAccDates.forEach(date => {
    accRowsByDate[date].forEach(accRow => {
      incorrectAccRows.push(accRow);
    });
  });

  console.log('simple check done');
  console.log('correctRows', correctRows);
  console.log('incorrectAccRows', incorrectAccRows);
  console.log('incorrectBankRows', incorrectBankRows);

  // find combinations within the incorrect rows
  const incorrectAccRowsSorted = stableSort(incorrectAccRows, (a, b) => b.value - a.value);
  const incorrectBankRowsSorted = stableSort(incorrectBankRows, (a, b) => b.value - a.value);

  const func = (rows: VerificationRow[], rowToMatch: VerificationRow) => {
    const matchingRows = findRowsThatSumTo(rows, rowToMatch.value);
    if (matchingRows.length > 0) {
      correctRows.push({ bank: [rowToMatch], acc: matchingRows });
      matchingRows.forEach(row => {
        const index = incorrectAccRowsSorted.findIndex(item => row.id === item.id);
        if (index !== -1) {
          incorrectAccRowsSorted.splice(index, 1);
        }
      });
      const index = incorrectBankRows.findIndex(item => rowToMatch.id === item.id);
      if (index !== -1) {
        incorrectBankRows.splice(index, 1);
      }
      return true;
    }
    return false;
  };

  incorrectBankRows.forEach((bankRow, i) => {
    let foundMatch = false;
    const accRowsSameDate = accRowsByDate[bankRow.date.toISOString().split('T')[0]] ?? [];
    if (accRowsSameDate.length > 0) {
      const incorrectAccRowsSameDate = incorrectAccRowsSorted.filter(row => accRowsSameDate.some(accRow => accRow.id === row.id));
      const sortedRowsSameDate = stableSort(incorrectAccRowsSameDate, (a, b) => b.value - a.value);
      foundMatch = func(sortedRowsSameDate, bankRow);
    }
    if (!foundMatch) {
      func(incorrectAccRowsSorted, bankRow);
    }
  });

  incorrectAccRows.forEach((accRow, i) => {
    let foundMatch = false;
    const bankRowsSameDate = bankRowsByDate[accRow.date.toISOString().split('T')[0]] ?? [];
    if (bankRowsSameDate.length > 0) {
      const incorrectBankRowsSameDate = incorrectBankRowsSorted.filter(row => bankRowsSameDate.some(bankRow => bankRow.id === row.id));
      const sortedRowsSameDate = stableSort(incorrectBankRowsSameDate, (a, b) => b.value - a.value);
      foundMatch = func(sortedRowsSameDate, accRow);
    }
    if (!foundMatch) {
      func(incorrectBankRowsSorted, accRow);
    }
  });

  console.log('HARD check done');
  console.log('correctRows', correctRows);
  console.log('incorrectAccRows', incorrectAccRows);
  console.log('incorrectBankRows', incorrectBankRows);

  return { correctRows, incorrectAccRows, incorrectBankRows };
};

// given a list of rows and a target value, find the rows that sum up to the target value
export const findRowsThatSumTo = (sortedRows: VerificationRow[], target: number) => {
  let result: VerificationRow[] = [];

  const find = (sum: number, index: number, current: VerificationRow[]) => {
    if (sum === target) {
      result = current;
      return;
    }
    if (sum > target) {
      return;
    }
    for (let i = index; i < sortedRows.length; i++) {
      const row = sortedRows[i];
      if (sum + row.value > target) {
        continue;
      }
      find(sum + row.value, i + 1, [...current, row]);
    }
  };

  find(0, 0, []);

  return result;
};
