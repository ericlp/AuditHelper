import React from 'react';

import gstyles from '../../styles/globals.module.css';
import { AccountingData, calculatedDiscrepencies, CombinedRows, findCommonDates } from '../../utils/AccountDataTypes';

import styles from './Tables.module.css';

interface BankTableProps {
  bank: AccountingData;
  acc: AccountingData;
}

export const BankTable: React.FC<BankTableProps> = ({ bank, acc }) => {
  const { correctRows, incorrectAccRows, incorrectBankRows } = calculatedDiscrepencies(bank, acc);
  const incorrectRows: CombinedRows[] = [
    ...incorrectAccRows.map(row => ({
      bank: null,
      acc: [row],
    })),
    ...incorrectBankRows.map(row => ({ bank: row, acc: [] })),
  ];

  const { start, end } = findCommonDates(bank, acc);

  const allRows = organizeRowsForTable(correctRows, incorrectRows);
  const allIncorrectRows = organizeRowsForTable([], incorrectRows);
  const [showAll, setShowAll] = React.useState(true);

  const rowsToDisplay = showAll ? allRows : allIncorrectRows;

  const toggleShowAllButton = (
    <button className={styles.toggleButton} onClick={() => setShowAll(prev => !prev)}>
      {showAll ? 'Hide correct rows' : 'Show correct rows'}
    </button>
  );

  return (
    <div className={gstyles.column}>
      <div className={styles.titleRow}>
        <p> {`Showing ${rowsToDisplay.length} event/s between ${start.toLocaleDateString('sv')} and ${end.toLocaleDateString('sv')}`} </p>
        {toggleShowAllButton}
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.styledTable}>
          <thead>
            <tr>
              <th>Ver Nr</th>
              <th>Date</th>
              <th>Bank</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>{rowsToDisplay}</tbody>
        </table>
      </div>
    </div>
  );
};

interface TableRowProps {
  verNr?: string;
  date: Date;
  left?: number;
  right?: number;
}

type CustomTableRowProps = TableRowProps & { className: string };

const IncorrectTableRow: React.FC<TableRowProps> = props => {
  return <ComparisonTableRow className={styles.incorrectTableRow} {...props} />;
};

const CorrectTableRow: React.FC<TableRowProps> = props => {
  return <ComparisonTableRow className={''} {...props} />;
};

const ComparisonTableRow: React.FC<CustomTableRowProps> = ({ verNr, date, left, right, className }) => {
  return (
    <tr className={className}>
      <td>{verNr ?? ''}</td>
      <td>{date.toISOString().split('T')[0]}</td>
      <td style={{ textAlign: 'end' }}>{left ?? '-'}</td>
      <td style={{ textAlign: 'end' }}>{right ?? '-'}</td>
    </tr>
  );
};

const renderCombinedRows = (row: CombinedRows) => {
  const { bank } = row;
  const firstAcc = row.acc[0];

  if (bank && firstAcc) {
    return <CorrectTableRow verNr={firstAcc.verNr} date={bank.date} left={bank.value} right={firstAcc.value} />;
  } else if (!bank || !firstAcc) {
    return <IncorrectTableRow verNr={firstAcc?.verNr} date={bank?.date ?? firstAcc.date} left={bank?.value} right={firstAcc?.value} />;
  } else {
    return (
      <div style={{ border: 'solid 5px green' }}>
        <CorrectTableRow date={bank.date} left={bank.value} key={bank.id} />
        {row.acc.map(a => (
          <ComparisonTableRow
            className={a.date != bank?.date ? styles.incorrectTableRow : ''}
            verNr={a.verNr}
            date={a.date}
            right={a.value}
            key={a.id}
          />
        ))}
      </div>
    );
  }
};

const organizeRowsForTable = (correct: CombinedRows[], incorrect: CombinedRows[]) => {
  const allRows = [...correct, ...incorrect];
  const sortedRows = allRows.sort((a, b) => {
    const dateA = a.bank?.date ?? a.acc[0].date;
    const dateB = b.bank?.date ?? b.acc[0].date;
    return dateA.getTime() - dateB.getTime();
  });
  return sortedRows.map(renderCombinedRows);
};
