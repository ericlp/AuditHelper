import { findRowsThatSumTo, VerificationRow } from '../utils/AccountDataTypes';

test('AccountDataType', () => {
  const verRows: VerificationRow[] = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
  ] as VerificationRow[];

  const a = findRowsThatSumTo(verRows, 4);
  console.log('a', a);
  expect(2).toBe(2);
});
