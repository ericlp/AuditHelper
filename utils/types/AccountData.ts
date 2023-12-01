import { stableSort } from '../stableSort';

import { findCommonDates, getCombinedRows, VerificationRow } from './VerificationRow';

export class AccountingData {
  public left: VerificationRow[];
  public right: VerificationRow[];
  public startDate: Date;
  public endDate: Date;
  constructor(left: VerificationRow[], right: VerificationRow[]) {
    const sortedLeftValue = stableSort(left, (a, b) => a.value - b.value);
    const sortedLeftValueDate = stableSort(sortedLeftValue, (a, b) => a.date.getTime() - b.date.getTime());

    const sortedRightValue = stableSort(right, (a, b) => a.value - b.value);
    const sortedRightValueDate = stableSort(sortedRightValue, (a, b) => a.date.getTime() - b.date.getTime());

    this.left = sortedLeftValueDate;
    this.right = sortedRightValueDate;

    const { start, end } = findCommonDates(this.left, this.right);
    console.log(start, end);
    this.startDate = start;
    this.endDate = end;
  }

  public get leftCommonInterval() {
    return this.left.filter(
      row => (this.startDate != null ? row.date >= this.startDate : true) && (this.endDate != null ? row.date <= this.endDate : true),
    );
  }

  public get rightCommonInterval() {
    return this.right.filter(
      row => (this.startDate != null ? row.date >= this.startDate : true) && (this.endDate != null ? row.date <= this.endDate : true),
    );
  }

  public get getCombinedRows() {
    return getCombinedRows(this.leftCommonInterval, this.rightCommonInterval);
  }

  public combine(accountingData: AccountingData) {
    this.left = [...this.left, ...accountingData.left];
    this.right = [...this.right, ...accountingData.right];
    const { start, end } = findCommonDates(this.left, this.right);
    this.startDate = start;
    this.endDate = end;
  }
}
