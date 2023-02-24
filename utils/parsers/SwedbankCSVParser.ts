import { AccountingData, AccountingDataCtor, VerificationRow } from '../AccountDataTypes';
import { toDate } from '../toDate';

// Exmaple of output from Swedbank
`* Transaktionsrapport Period 2022-07-01 – 2022-11-26 Skapad 2022-11-26 19:19 CET\t\t\t\t\t\t\t\t\t\t\t
Radnr\tClnr\tKontonr\tProdukt\tValuta\tBokfdag\tTransdag\tValutadag\tReferens\tText\tBelopp\tSaldo
1\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-24\t2022-11-24\t2022-11-24\tGolly Pasta Johanneber K4111\tKortköp/uttag\t-238\t209279.96
2\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-23\t2022-11-23\t2022-11-23\tKlarna*adlibris.se K4111\tKortköp/uttag\t-187\t209517.96
3\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-23\t2022-11-23\t2022-11-23\tBidrag\tÖverföring via internet\t-10000\t209704.96
4\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-22\t2022-11-22\t2022-11-23\tPAYPAL PTE\tBg kontoinsättning\t5686.15\t219704.96
5\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-16\t2022-11-16\t2022-11-16\tAMAZONMKTPLC*O029R0BW5 K4111\tKortköp/uttag\t-448.67\t214018.81
6\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-15\t2022-11-15\t2022-11-15\tDAHLS BAGERI    K4111\tKortköp/uttag\t-305\t214467.48
7\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tAMAZONRETAIL*7L4ZS3SA5 K4111\tKortköp/uttag\t-134.98\t214772.48
8\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA103\tÖverföring via internet\t-300\t214907.46
9\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA115\tÖverföring via internet\t-47.8\t215207.46
16\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA109\tÖverföring via internet\t-75\t217121.3
17\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA125\tÖverföring via internet\t-500.9\t217196.3
18\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA110\tÖverföring via internet\t-505\t217697.2
19\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA120\tÖverföring via internet\t-50\t218202.2
20\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA102\tÖverföring via internet\t-150\t218252.2
21\t81059\t9843435208\tFöretagskonto\tSEK\t2022-11-14\t2022-11-14\t2022-11-14\tA122\tÖverföring via internet\t-327.8\t218402.2`;

export const parseSwedbank = (input: string): AccountingData | null => {
  // split and remove last empty line
  const lines = input.split('\n').filter(line => line.length > 0);
  const rows = lines.slice(2).map(line => line.split(','));

  // Read incoming saldo from total of first row
  const incomingSaldo = parseFloat(rows[0][1]);
  if (isNaN(incomingSaldo)) return null;

  const verificationsRows = rows.map((row, i) => parseSwedbankRow(row, i));

  return AccountingDataCtor(incomingSaldo, verificationsRows);
};

const parseSwedbankRow = (row: string[], id: number): VerificationRow => {
  if (row.length < 12) {
    console.error('Row has wrong number of columns', row);
    throw new Error(`Row ${id} has ${row.length} columns, expected at least 12`);
  }
  const [_Radnr, _Clnr, _Kontonr, _Produkt, _Valuta, Bokfdag, _Transdag, _Valutadag] = row.slice(0, 8);

  // The message may have commas in it, so we have to join them up again
  const [_Saldo, Belopp, _Text, ...restRest] = row.slice(8, row.length).reverse();
  const Meddelande = restRest.reverse().join(',');
  return {
    id,
    date: toDate(Bokfdag),
    text: Meddelande,
    value: parseFloat(Belopp),
  };
};
