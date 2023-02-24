import { AccountingData, AccountingDataCtor, VerificationRow } from '../AccountDataTypes';
import { toDate } from '../toDate';

// Example output from Fortnox
`Bengt-Arne Rydgård\t\tSida:\t       1
                                  Kontoanalys\t\tUtskrivet:\t23-02-10
\t\t\t   19:49
Räkenskapsår: 22-01-01 - 22-12-31\t\tSenaste vern  \t    A274
Hela företaget
Period: 22-01-01 - 22-12-31

Konto: 1930

Konto\tNamn
\tVernr\tDatum\tTe  \t          Debet\t         Kredit\t          Saldo
--------------------------------------------------------------------------------
1930\tCheckräkning
\t\tIngående balans:\t\t\t\t     220 467,62
\t\tIngående sa    \t\t\t\t     220 467,62

\tA1\t22-01-09\tUt                         \t\t      83 992,00\t     136 475,62
\tA1\t22-01-09\tUt                         \t\t      22 317,00\t     114 158,62
\tA1\t22-01-09\tUt                         \t\t       9 110,00\t     105 048,62
\tA1\t22-01-09\tUt                         \t\t         154,00\t     104 894,62
\tA1\t22-01-09\tUt                         \t\t       4 810,00\t     100 084,62
\tA1\t22-01-09\tUt                         \t\t       6 111,00\t      93 973,62
\tA1\t22-01-09\tUt                         \t\t      19 094,00\t      74 879,62
\tA1\t22-01-09\tUt                         \t\t      52 302,02\t      22 577,60
\tA10\t22-01-12\tAr            \t     228 223,31\t\t     250 800,91
\tA2\t22-01-16\tUt                         \t\t       2 190,00\t     248 610,91
\tA2\t22-01-16\tUt                         \t\t      45 678,00\t     202 932,91
\tA2\t22-01-16\tUt                         \t\t       7 774,00\t     195 158,91
\tA2\t22-01-16\tUt                         \t\t         121,00\t     195 037,91
\tA2\t22-01-16\tUt                         \t\t      40 480,00\t     154 557,91
\t\t-----------------------------------------------------------
\t\tOmslutning:\t\t  10 101 520,88\t   9 975 004,92
\t\tUtgående sa    \t\t  10 101 520,88\t   9 975 004,92\t     346 983,58
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
Total kontoomslutning:\t\t\t\t  10 101 520,88\t   9 975 004,92
-------------------------------------------------------------------------------`;

export const parseAxel = (input: string): AccountingData | null => {
  const lines = input.split('\n');

  // Find the header separator
  const startTableIndex = lines.findIndex(line => line.startsWith('-'));
  if (startTableIndex === -1) return null;

  // The saldo is placed in the table on its own row
  const incomingSaldoRow = lines[startTableIndex + 3].split('\t').filter(a => a);
  const incomingSaldo = parseFloat(incomingSaldoRow[incomingSaldoRow.length - 1]);

  // Find the end of the table
  const withoutHeader = lines.slice(startTableIndex + 5);
  const endTableIndex = withoutHeader.findIndex(line => line.startsWith('-'));
  if (endTableIndex === -1) return null;

  const verificationsRows = withoutHeader
    .slice(0, endTableIndex - 3)
    .map(line => line.split('\t'))
    .map((row, i) => parseAxelRow(row, i));

  return AccountingDataCtor(incomingSaldo, verificationsRows);
};

const preFloatParseFormat = (str: string) => (str ?? '').trim().replace(/\s/g, '').replace(',', '.');

const parseAxelRow = (row: string[], id: number) => {
  const [_empty, Vernr, Datum, Text, Debet, Kredit, _Saldo] = row;
  const debet = parseFloat(preFloatParseFormat(Debet));
  return {
    id,
    verNr: Vernr,
    date: toDate(Datum),
    text: Text,
    value: isNaN(debet) ? -parseFloat(preFloatParseFormat(Kredit)) : debet,
  };
};
