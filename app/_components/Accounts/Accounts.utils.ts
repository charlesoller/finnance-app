import { AccountData } from '../../_models/AccountData';
import { LineChartDataPoint } from '../../_models/ChartData';
import { RunningTotalData } from '../../_models/TransactionData';
export interface GroupedAccounts {
  cash?: AccountData[];
  savings?: AccountData[];
  loans?: AccountData[];
  credit_card?: AccountData[];
  other?: AccountData[];
}

export const ORDERED_ACCT_TYPES = [
  'cash',
  'savings',
  'credit_card',
  'loans',
  'other',
];

export const groupAccountsByType = (accounts: AccountData[]) => {
  const grouped: GroupedAccounts = {};

  accounts.forEach((acct) => {
    let acctType: keyof GroupedAccounts;
    const { category, subcategory } = acct;

    if (
      category === 'credit' &&
      (subcategory === 'other' || subcategory === 'mortgage')
    ) {
      acctType = 'loans';
    } else if (category === 'credit') {
      acctType = 'credit_card';
    } else if (category === 'investment') {
      acctType = 'savings';
    } else {
      acctType = category as keyof GroupedAccounts;
    }

    if (acctType in grouped && !!grouped[acctType]) {
      grouped[acctType] = [...grouped[acctType]!, acct];
    } else {
      grouped[acctType] = [acct];
    }
  });

  return grouped;
};

export const getCurrentTotal = (accounts: AccountData[]) => {
  let total = 0;
  for (const account of accounts) {
    const balance = account?.balance?.current?.usd;
    if (!balance) continue;

    if (account.category === 'credit') {
      total -= Math.abs(balance);
    } else {
      total += balance;
    }
  }
  return total / 100;
};

export const formatNetWorthData = (
  data: RunningTotalData[],
): LineChartDataPoint[] => {
  return data?.map(({ total, date }) => ({
    date: String(new Date(date)),
    amount: total / 100,
  }));
};

export const getTotal = (data: AccountData[]): number => {
  let total = 0;
  data.forEach((acct) => {
    if (acct?.balance?.current?.usd) {
      total += acct.balance?.current?.usd;
    }
  });
  return total;
};

export const timeAgo = (timestamp: number): string => {
  if (typeof timestamp !== 'number') return 'Loading...';

  const now = Math.floor(Date.now() / 1000);
  const secondsAgo = now - timestamp;
  const hoursAgo = Math.floor(secondsAgo / 3600);
  if (hoursAgo < 1) {
    return 'Just now';
  }

  return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
};
