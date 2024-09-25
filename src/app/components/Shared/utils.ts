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
