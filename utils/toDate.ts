export const toDate = (dateStr: string) => {
  let [year, month, day] = dateStr.split('-').map(a => +a);
  year < 100 && (year += 2000);
  const newDate = new Date(year, month - 1, day);
  newDate.setHours(23, 0, 0, 0);
  return newDate;
};
