import { floatIsSame } from '../floatIsSame';

export interface VerificationRow {
  id: number;
  verNr?: string;
  date: Date;
  text: string;
  value: number;
}

export type VerificationRowByDate = Record<string, VerificationRow[]>;

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

const withDate = (groupedRows: VerificationRowByDate, date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  return groupedRows[dateStr] || [];
};

export const findCommonDates = (left: VerificationRow[], right: VerificationRow[]) => {
  const func = (list: VerificationRow[], max = true) =>
    list.reduce((acc, row) => (acc.getTime() < row.date.getTime() ? row.date : acc), list[0].date);
  const leftMaxDate = left.reduce((acc, row) => (acc.getTime() < row.date.getTime() ? row.date : acc), left[0].date);
  const rightMaxDate = right.reduce((acc, row) => (acc.getTime() < row.date.getTime() ? row.date : acc), right[0].date);
  const smallerMaxDate = leftMaxDate.getTime() < rightMaxDate.getTime() ? leftMaxDate : rightMaxDate;

  const leftMinDate = left.reduce((acc, row) => (acc.getTime() > row.date.getTime() ? row.date : acc), left[0].date);
  const rightMinDate = right.reduce((acc, row) => (acc.getTime() > row.date.getTime() ? row.date : acc), right[0].date);
  const biggerMinDate = leftMinDate.getTime() > rightMinDate.getTime() ? leftMinDate : rightMinDate;

  return { start: biggerMinDate, end: smallerMaxDate };
};

export interface CombinedRows {
  left: VerificationRow[];
  right: VerificationRow[];
}
export const getCombinedRows = (left: VerificationRow[], right: VerificationRow[]): CombinedRows[] => {
  const leftRowsByDate = groupByDate(left);
  const leftRows = [...left];
  const rightRowsByDate = groupByDate(right);
  const rightRows = [...right];
  const correctRows1 = findMatches(rightRows, leftRows, rightRowsByDate, (target, matches) => ({
    left: [target],
    right: matches,
  }));
  const correctRows2 = findMatches(leftRows, rightRows, leftRowsByDate, (target, matches) => ({
    left: matches,
    right: [target],
  }));
  const incorrectLeftRows: CombinedRows[] = leftRows.map(row => ({ left: [row], right: [] }));
  const incorrectRightRows: CombinedRows[] = rightRows.map(row => ({ left: [], right: [row] }));

  return [...correctRows1, ...correctRows2, ...incorrectLeftRows, ...incorrectRightRows].sort((combinedRowA, combinedRowB) => {
    const earliestBankDayA = combinedRowA.left[0] ?? combinedRowA.right[0];
    const earliestBankDayB = combinedRowB.left[0] ?? combinedRowB.right[0];
    return earliestBankDayA.date.getTime() - earliestBankDayB.date.getTime();
  });
};

const findMatches = (
  baseRows: VerificationRow[],
  targetRows: VerificationRow[],
  baseRowsByDate: VerificationRowByDate,
  resCtor: (target: VerificationRow, matches: VerificationRow[]) => CombinedRows,
) => {
  const correctRows: CombinedRows[] = [];
  targetRows.slice().forEach(targetRow => {
    const baseRowsSameDate = withDate(baseRowsByDate, targetRow.date);
    if (baseRowsSameDate.length > 0) {
      const match = baseRowsSameDate.find(baseRow => floatIsSame(baseRow.value, targetRow.value));
      if (match) {
        correctRows.push(resCtor(targetRow, [match]));
        deleteFromList(targetRows, targetRow.id);
        deleteFromList(baseRows, match.id);
        deleteFromList(baseRowsSameDate, match.id);
        return;
      }
      const matchingRows = findRowsThatSumTo(baseRowsSameDate, targetRow.value);
      if (matchingRows.length > 0) {
        correctRows.push(resCtor(targetRow, matchingRows));
        deleteFromList(targetRows, targetRow.id);
        matchingRows.forEach(row => {
          deleteFromList(baseRows, row.id);
          deleteFromList(baseRowsSameDate, row.id);
        });
      }
    }
  });
  return correctRows;
};

const deleteFromList = (list: VerificationRow[], id: number) => {
  const index = list.findIndex(item => item.id === id);
  if (index !== -1) {
    list.splice(index, 1);
  }
};

// given a list of rows and a target value, find the rows that sum up to the target value
export const findRowsThatSumTo = (sortedRows: VerificationRow[], target: number) => {
  let result: VerificationRow[] = [];

  const find = (sum: number, index: number, current: VerificationRow[]) => {
    if (sum === target) {
      result = current;
      return;
    }
    if (Math.abs(sum) > Math.abs(target)) {
      return;
    }
    for (let i = index; i < sortedRows.length; i++) {
      if (result.length > 0) {
        return;
      }
      const row = sortedRows[i];
      if (Math.abs(sum + row.value) > Math.abs(target)) {
        continue;
      }
      find(sum + row.value, i + 1, [...current, row]);
    }
  };

  find(0, 0, []);

  return result;
};
