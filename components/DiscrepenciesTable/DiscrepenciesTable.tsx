import React from 'react';

import { inspect } from 'util';

import {
  AccountingData,
  calculatedDiscrepencies,
  getValuesFromMerge,
  happendBefore,
  MergedRowsByEquality,
  VerificationRow,
} from '../../utils/AccountDataTypes';

import styles from './DiscrepenciesTable.module.css';

interface DiscrepenciesTableProps {
  bank: AccountingData;
  acc: AccountingData;
}

interface TableRowProps {
  merge: MergedRowsByEquality;
}

type CustomTableRowProps = TableRowProps & { className: string };

const IncorrectTableRow: React.FC<TableRowProps> = props => {
  return <TableRow className={styles.incorrectTableRow} {...props} />;
};

const CorrectTableRow: React.FC<TableRowProps> = props => {
  return <TableRow className={styles.correctTableRow} {...props} />;
};

const TableRow: React.FC<CustomTableRowProps> = ({ merge, className }) => {
  const item = getValuesFromMerge(merge);
  return (
    <tr className={className}>
      <td>{merge.acc?.verNr ?? ''}</td>
      <td>{item.date.toISOString().split('T')[0]}</td>
      <td style={{ textAlign: 'end' }}>{merge.bank?.value ?? '-'}</td>
      <td style={{ textAlign: 'end' }}>{merge.acc?.value ?? '-'}</td>
    </tr>
  );
};

const organizeRowsForTable = (correct: MergedRowsByEquality[], incorrect: MergedRowsByEquality[]) => {
  if (correct.length === 0) {
    return incorrect.map((row, index) => <IncorrectTableRow key={index} merge={row} />);
  }
  if (incorrect.length === 0) {
    return correct.map((row, index) => <CorrectTableRow key={index} merge={row} />);
  }

  const rows = [];
  let corrI = 0;
  let incorrI = 0;

  while (corrI < correct.length && incorrI < incorrect.length) {
    const corrRow = correct[corrI];
    const incorrRow = incorrect[incorrI];
    if (happendBefore(corrRow, incorrRow)) {
      rows.push(<CorrectTableRow key={corrI} merge={corrRow} />);
      corrI++;
    } else {
      rows.push(<IncorrectTableRow key={incorrI + correct.length} merge={incorrRow} />);
      incorrI++;
    }
  }

  while (corrI < correct.length) {
    const corrRow = correct[corrI];
    rows.push(<CorrectTableRow key={corrI} merge={corrRow} />);
    corrI++;
  }

  while (incorrI < incorrect.length) {
    const incorrRow = incorrect[incorrI];
    rows.push(<IncorrectTableRow key={incorrI + correct.length} merge={incorrRow} />);
    incorrI++;
  }

  return rows;
};

export const DiscrepenciesTable: React.FC<DiscrepenciesTableProps> = ({ bank, acc }) => {
  const { correctRows, incorrectAccRows, incorrectBankRows } = calculatedDiscrepencies(bank, acc);

  console.log('incorrectAccRows', incorrectAccRows);
  console.log('incorrectBankRows', incorrectBankRows);
  const rows = organizeRowsForTable(correctRows, [...incorrectAccRows, ...incorrectBankRows]);

  return (
    <>
      <h1>Discrepencies</h1>
      <table>
        <thead>
          <tr>
            <th>Ver Nr</th>
            <th>Date</th>
            <th>Bank</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};
