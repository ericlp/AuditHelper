import { toDate } from '../toDate';
import { AccountingData } from '../types/AccountData';
import { VerificationRow } from '../types/VerificationRow';

// Example output from Fortnox
// Kontoanalys
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

// KontoAnalys
export const parseFortnoxAccount = (input: string): VerificationRow[] | null => {
  const lines = input.split('\n');

  // Find the header separator
  const startTableIndex = lines.findIndex(line => line.startsWith('-'));
  if (startTableIndex === -1) return null;

  // Find the end of the table
  const withoutHeader = lines.slice(startTableIndex + 4);
  const endTableIndex = withoutHeader.findIndex(line => line.startsWith('-'));
  if (endTableIndex === -1) return null;

  return withoutHeader
    .slice(0, endTableIndex)
    .map(line => line.split('\t').filter(a => a))
    .map((row, i) => parseFortnoxRow(row, i));
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

// Example output from Fortnox
// huvudbok
`Report   
Teknologsektionen Informationsteknik
857209-9524
Räkenskapsår 2022-07-01 - 2023-06-30
Period 2022-07-01 - 2023-06-30
Huvudbok
Kostnadsställe 40 - P.R.I.TUtskrivet 2023-03-02 21:05
Senaste vernr A 300  B 93  C 80  D 223  E 206  F 29  G 67  H 10  I 62  M 36  N 36  T 27  
Konto\tNamn/Vernr\tKs\t\tDatum\tText\tTransaktionsinfo\tDebet\tKredit\tSaldo\t
-------------------------
5630\tParkeringsavgifter\t
\t\t\t\tIngående saldo\t\t\t0,00\t0,00\t0,00\t
\tD 88\t40\t\t2022-10-07\tMU - Parkering(SÄPO)\t\t17,00\t\t17,00\t
\tC 6\t30\t\t2020-08-24\tMB - Mat nollan lunch\t\t\t3 036,61\t152 947,26\t
\tD 134\t40\t\t2022-11-03\tMU - Parkering(SÄPO)\t\t26,00\t\t43,00\t
\tD 155\t40\t\t2022-12-15\tMU - Parkeringsavgift (SÄPO)\t\t19,00\t\t62,00\t
-------------------------
\t\t\t\tOmslutning\t\t\t62,00\t0,00\t62,00\t
\t\t\t\tUtgående saldo\t\t\t 62,00\t0,00\t62,00\t
-------------------------
5920\tProfilkläder och material\t
\t\t\t\tIngående saldo\t\t\t0,00\t0,00\t0,00\t
\tD 214\t40\t\t2023-01-01\tMU Interimfordran Arbetsbyxor Chrono\t\t799,00\t\t799,00\t
\tD 216\t40\t\t2023-01-01\tMU interimfordran P.R.I.T.23 Kilt profilering (Humlan)\t\t1 094,00\t\t1 893,00\t
\tD 218\t40\t\t2023-01-01\tInterimfordran P.R.I.T.23 Färg overaller\t\t677,04\t\t2 570,04\t
\tD 219\t40\t\t2023-01-01\tInterimfordran Arbetsbyxor profilering\t\t4 794,00\t\t7 364,04\t
-------------------------
\t\t\t\tOmslutning\t\t\t7 364,04\t0,00\t7 364,04\t
\t\t\t\tUtgående saldo\t\t\t 7 364,04\t0,00\t7 364,04\t
-------------------------
-------------------------
Huvudboksomslutning\t\t\t\t\t\t\t639 157,62\t583 317,62\t\t
-------------------------
`;

export type Ledger = Record<string, AccountingData>;

// HuvudBok
export const parseFortnoxLedger = (input: string) => {
  const groups = input.split('-------------------------');
  groups.splice(0, 1);
  groups.splice(groups.length - 3, 3);
  const accountingRowGroups = groups.filter((_, i) => i % 2 === 0);
  const ledger: Ledger = {};
  accountingRowGroups.forEach(group => {
    const rows = group.split('\n').filter(line => line.length > 0);
    const title = rows[0].replace('\t', ' ').trim();
    const left: VerificationRow[] = [];
    const right: VerificationRow[] = [];
    rows
      .slice(2)
      .map(line => line.split('\t'))
      .forEach((row, id) => {
        if (row.length !== 11) {
          console.error('Row has wrong number of columns', row);
          throw new Error(`Row ${id} has ${row.length} columns, expected 10. Could be a tab character in Text Column.`);
        }
        const [_Konto, verNr, _Ks, _, Datum, text, _Transaktionsinfo, Debet, Kredit, _Saldo] = row;
        const debet = parseFloat(preFloatParseFormat(Debet));
        console.log(debet);
        const formattedRow: VerificationRow = {
          id,
          verNr,
          date: toDate(Datum),
          text,
          value: debet,
        };

        if (isNaN(debet)) {
          formattedRow.value = parseFloat(preFloatParseFormat(Kredit));
          right.push(formattedRow);
        } else {
          left.push(formattedRow);
        }
      });
    console.log(left.length);
    console.log(right.length);
    // ledger[title] = new AccountingData(left, right);
  });
  return ledger;
};
