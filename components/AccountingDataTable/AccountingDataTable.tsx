import { VerificationRow } from '../../utils/AccountDataTypes';

interface AccountingDataTableProps {
  AccountingData: VerificationRow[];
  Title: string;
}

export const AccountingDataTable: React.FC<AccountingDataTableProps> = ({ AccountingData, Title }) => {
  AccountingData;
  return (
    <>
      <h1>{Title}</h1>

      <table>
        <thead>
          <tr>
            <th>Ver Nr</th>
            <th>Date</th>
            <th>Value</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {AccountingData.map((row, index) => (
            <tr key={index}>
              <td>{row.verNr}</td>
              <td>{row.date.toISOString().split('T')[0]}</td>
              <td>{row.value}</td>
              <td>{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
