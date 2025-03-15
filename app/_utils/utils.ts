import { MantineTheme } from '@mantine/core';
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

export const formatDate = (date: Date, short: boolean = false) => {
  const local = utcToLocal(date);

  if (short) {
    const month = format(local, 'MMM');
    const day = format(local, 'd');
    return `${month} ${day}`;
  }

  const day = format(local, 'd');
  const month = format(local, 'MMMM');
  const year = format(local, 'yyyy');

  return `${month} ${getOrdinalSuffix(Number(day))}, ${year}`;
};

export const cleanDateString = (dateStr: string): string => {
  return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal suffix
};

export const utcToLocal = (date: Date): Date => {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Convert Date to ISO string first if it's a Date object
  const utc = date instanceof Date ? date : parseISO(String(date));
  const localTime = toZonedTime(utc, localTimezone);
  return localTime;
};

export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export const formatCurrency = (
  amount: number,
  short: boolean = false,
): string => {
  return `$${Number(amount)
    .toFixed(short ? 0 : 2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const borderColor = (colorScheme: string, theme: MantineTheme) => {
  if (colorScheme === 'light') {
    return theme.colors.gray[3];
  } else {
    return theme.colors.dark[4];
  }
};

export type SupportedBanks =
  | 'StripeBank'
  | 'Chase'
  | 'American Express'
  | 'Wealthfront'
  | 'Bank of America'
  | 'Discover Bank'
  | 'Capital One'
  | 'Fidelity';

export const getBankLogoSrc = (bankName: SupportedBanks | string) => {
  if (bankName.toLowerCase() === 'stripebank') return '/logos/stripe.webp';
  if (bankName.toLowerCase() === 'american express') return '/logos/amex.webp';
  if (bankName.toLowerCase() === 'chase') return '/logos/chase.webp';
  if (bankName.toLowerCase() === 'wealthfront')
    return '/logos/wealthfront.webp';
  if (bankName.toLowerCase() === 'bank of america')
    return '/logos/bankofamerica.webp';
  if (bankName.toLowerCase() === 'discover bank') {
    return '/logos/discover.webp';
  }
  if (bankName.toLowerCase() === 'capital one') {
    return '/logos/capitalone.webp';
  }
  if (bankName.toLowerCase() === 'fidelity') {
    return '/logos/fidelity.webp';
  } else return null;
};
