import React from 'react';

import { VerificationRow } from '../../utils/AccountDataTypes';

import styles from './Tables.module.css';

interface AccountingDataTableProps {
  rows: VerificationRow[];
}

export const VerificationRowTable: React.FC<AccountingDataTableProps> = ({ rows }) => {
  return (
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
        <tbody>
          {rows.map(r => (
            <TableRow row={r} key={r.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  row: VerificationRow;
}

const TableRow: React.FC<TableRowProps> = ({ row }) => {
  return (
    <tr>
      <td>{row.verNr ?? ''}</td>
      <td>{row.date.toISOString().split('T')[0]}</td>
      <td style={{ textAlign: 'end' }}>{row.value ?? '-'}</td>
    </tr>
  );
};
