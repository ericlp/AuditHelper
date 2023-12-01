import { parseFortnoxLedger } from '../utils/parsers/FortnoxTSVParser';

// Example output from Fortnox
// huvudbok
const report = `Report   
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
\tC 5\t30\t\t2020-08-24\tFB - påsar spons Mottagning\t\t\t594,00\t155 983,87\t
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

test('AccountDataType', () => {
  parseFortnoxLedger(report);
  expect(2).toBe(2);
});
