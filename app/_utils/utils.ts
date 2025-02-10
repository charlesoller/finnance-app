import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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
  const local = utcToLocal(date);

  const day = format(local, 'd');
  const month = format(local, 'MMMM');
  const year = format(local, 'yyyy');

  return `${month} ${getOrdinalSuffix(Number(day))}, ${year}`;
};

export const utcToLocal = (date: Date): Date => {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utc = parseISO(String(date));
  const localTime = toZonedTime(utc, localTimezone);
  return localTime;
};

export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
