import { format } from 'date-fns';

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getOrdinalSuffix = (day: number) => {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) {
    return `${day}st`;
  }
  if (j === 2 && k !== 12) {
    return `${day}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${day}rd`;
  }
  return `${day}th`;
};

export const formatDate = (date: Date) => {
  const day = format(date, 'd');
  const month = format(date, 'MMMM');
  const year = format(date, 'yyyy');

  return `${month} ${getOrdinalSuffix(Number(day))}, ${year}`;
};
