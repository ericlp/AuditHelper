import React from 'react';

import gstyles from '../../styles/globals.module.css';
import { CombinedRows } from '../../utils/types/AccountDataTypes';

import styles from './Tables.module.css';

interface BankTableProps {
  rows: CombinedRows[];
}

export const ComparisonTable: React.FC<BankTableProps> = ({ rows }) => (
  <div className={gstyles.column}>
    <div className={styles.tableContainer}>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Ver Nr</th>
            <th>Date</th>
            <th style={{ textAlign: 'right' }}>Bank</th>
            <th style={{ textAlign: 'right' }}>Account</th>
          </tr>
        </thead>
        <tbody>{rows.map(renderCombinedRows)}</tbody>
      </table>
    </div>
  </div>
);

const renderCombinedRows = (row: CombinedRows, index: number): JSX.Element => {
  const firstleft = row.left[0];
  const firstRight = row.right[0];

  if (firstleft && firstRight) {
    if (row.left.length > 1 || row.right.length > 1) {
      return (
        <>
          {row.left.map((b, idx) => (
            <ComparisonTableRow className={styles.combinedTableRow} date={b.date} left={b.value} key={`${index}left${idx}`} />
          ))}
          {row.right.map((a, idx) => (
            <ComparisonTableRow
              className={styles.combinedTableRow}
              verNr={a.verNr}
              date={a.date}
              right={a.value}
              key={`${index}right${idx}`}
            />
          ))}
        </>
      );
    }
    return <CorrectTableRow verNr={firstRight.verNr} date={firstleft.date} left={firstleft.value} right={firstRight.value} key={index} />;
  } else {
    return (
      <IncorrectTableRow
        verNr={firstRight?.verNr}
        date={firstleft?.date ?? firstRight.date}
        left={firstleft?.value}
        right={firstRight?.value}
        key={index}
      />
    );
  }
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
