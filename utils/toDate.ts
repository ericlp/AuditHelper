export const toDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(+year, +month - 1, +day);
};
