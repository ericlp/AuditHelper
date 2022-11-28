import { AccountingData, AccountingDataCtor, VerificationRow } from '../AccountDataTypes';
import { toDate } from '../toDate';

// Example output from Fortnox
`Report   
Teknologsektionen Informationsteknik
857209-9524
Räkenskapsår 2022-07-01 - 2023-06-30
Period 2022-07-01 - 2023-06-30
Kontoanalys
1924 - Bankkonto FrITidUtskrivet 2022-11-26 10:37
Senaste vernr A 175  B 92  C 38  D 134  E 162  F 19  G 38  I 38  M 22  N 16  T 4  
Konto\tNamn/Vernr\tKs\t \tDatum\tText\tTransaktionsinfo\tDebet\tKredit\tSaldo\t
-------------------------
1924\tBankkonto FrITid\t
 \t \t \t \tIngående balans\t \t \t \t \t20 434,69\t
 \t \t \t \tIngående saldo\t \t \t0,00\t0,00\t20 434,69\t
 \tF 4\t 60\t \t2022-09-01 \tMB - Profilering \t \t \t2 000,00\t18 434,69\t
 \tF 5\t 60\t \t2022-09-01 \tMB - Profilering \t \t \t1 825,00\t16 609,69\t
 \tF 6\t 60\t \t2022-09-01 \tMB - Grönsåpa (inventarie) \t \t \t58,00\t16 551,69\t
 \tF 7\t 60\t \t2022-09-13 \tIFB - asp-snacks \t \t127,08\t \t16 678,77\t
 \tF 17\t 60\t \t2022-11-11 \tMB - Specialarr \t \t \t1 500,00\t12 491,77\t
 \tF 19\t 60\t \t2022-11-11 \tMB - Teambuilding mat \t \t \t500,00\t11 991,77\t
-------------------------
 \t \t \t \tOmslutning\t \t \t127,08\t8 570,00\t-8 442,92\t
 \t \t \t \tUtgående saldo\t \t \t 127,08\t8 570,00\t11 991,77\t
-------------------------
-------------------------
Kontoomslutning\t \t \t \t \t \t \t127,08\t8 570,00\t \t
-------------------------`;

export const parseFortnox = (input: string): AccountingData | null => {
  const lines = input.split('\n');

  // Find the header separator
  const startTableIndex = lines.findIndex(line => line.startsWith('-'));
  if (startTableIndex === -1) return null;

  // The saldo is placed in the table on its own row
  const incomingSaldoRow = lines[startTableIndex + 3].split('\t').filter(a => a);
  const incomingSaldo = parseFloat(incomingSaldoRow[incomingSaldoRow.length - 1]);

  // Find the end of the table
  const withoutHeader = lines.slice(startTableIndex + 4);
  const endTableIndex = withoutHeader.findIndex(line => line.startsWith('-'));
  if (endTableIndex === -1) return null;

  const verificationsRows = withoutHeader
    .slice(0, endTableIndex)
    .map(line => line.split('\t').filter(a => a))
    .map((row, i) => parseFortnoxRow(row, i));

  return AccountingDataCtor(incomingSaldo, verificationsRows);
};

const preFloatParseFormat = (str: string) => str.replace(/\s/g, '').replace(',', '.');

const parseFortnoxRow = (row: string[], id: number) => {
  if (row.length < 10) {
    console.error('Row has wrong number of columns', row);
    throw new Error(`Row ${id} has ${row.length} columns, expected 10`);
  }
  const [_Konto, Vernr, _Ks, _, Datum, Text, _Transaktionsinfo, Debet, Kredit, _Saldo] = row;
  const debet = parseFloat(preFloatParseFormat(Debet));
  return {
    id,
    verNr: Vernr,
    date: toDate(Datum),
    text: Text,
    value: isNaN(debet) ? -parseFloat(preFloatParseFormat(Kredit)) : debet,
  };
};
