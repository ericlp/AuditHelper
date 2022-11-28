export const toDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(a => +a);
  return new Date(year, month - 1, day);
};
