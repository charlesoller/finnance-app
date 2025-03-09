import { AccountData } from '../../_models/AccountData';
import { LineChartDataPoint } from '../../_models/ChartData';
import { RunningTotalData } from '../../_models/TransactionData';

export interface GroupedAccounts {
  checking?: AccountData[];
  savings?: AccountData[];
  mortgage?: AccountData[];
  credit_card?: AccountData[];
  other?: AccountData[];
}

export const ORDERED_ACCT_TYPES = [
  'checking',
  'savings',
  'credit_card',
  'mortgage',
  'other',
];

export const groupAccountsByType = (accounts: AccountData[]) => {
  const grouped: GroupedAccounts = {};

  accounts.forEach((acct) => {
    let { subcategory: category } = acct;
    if (category === 'line_of_credit') {
      category = 'credit_card';
    }

    if (category in grouped && !!grouped[category]) {
      grouped[category] = [...grouped[category]!, acct];
    } else {
      grouped[category] = [acct];
    }
  });

  return grouped;
};

export const getCurrentNet = (accounts: GroupedAccounts) => {
  let total: number = 0;

  // Cash
  accounts.checking?.forEach(
    (acct) => (total += acct.balance?.current?.usd || 0),
  );
  accounts.savings?.forEach(
    (acct) => (total += acct.balance?.current?.usd || 0),
  );

  // Debt
  accounts.credit_card?.forEach(
    (acct) => (total -= acct.balance?.current?.usd || 0),
  );

  return total;
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
  const now = Math.floor(Date.now() / 1000);
  const secondsAgo = now - timestamp;
  const hoursAgo = Math.floor(secondsAgo / 3600);
  if (hoursAgo < 1) {
    return 'Just now';
  }

  return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
};
