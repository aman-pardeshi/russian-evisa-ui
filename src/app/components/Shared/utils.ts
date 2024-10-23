const months: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const getDateInFormat = (givenDate: Date) => {
  const date = givenDate.getDate();
  const month = months[givenDate.getMonth()];
  const year = givenDate.getFullYear();

  return `${month} ${date}, ${year}`;
};

export const getDateInDDMMYYY = (searchFromDate: Date) => {
  const year = searchFromDate.getFullYear();
  const month = (searchFromDate.getMonth() + 1).toString().padStart(2, '0');
  const day = searchFromDate.getDate().toString().padStart(2, '0');

  return `${day}-${month}-${year}`;
};

export const getDateInYYYYMMDD = (searchFromDate: Date) => {
  const year = searchFromDate.getFullYear();
  const month = (searchFromDate.getMonth() + 1).toString().padStart(2, '0');
  const day = searchFromDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};