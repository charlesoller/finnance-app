import { AccountData } from '../../_models/AccountData';
import { LineChartDataPoint } from '../../_models/ChartData';
import {
  RunningTotalData,
  TransactionData,
} from '../../_models/TransactionData';

export interface GroupedAccounts {
  cash?: AccountData[];
  savings?: AccountData[];
  mortgage?: AccountData[];
  credit_card?: AccountData[];
  other?: AccountData[];
}

export const ORDERED_ACCT_TYPES = [
  'cash',
  'savings',
  'credit_card',
  'mortgage',
  'other',
];

export const groupAccountsByType = (accounts: AccountData[]) => {
  const grouped: GroupedAccounts = {};

  accounts.forEach((acct) => {
    let acctType: keyof GroupedAccounts;
    const { category, subcategory } = acct;

    if (category === 'credit') {
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
  return total;
};

export const computeTransactionData = (
  accounts?: AccountData[],
  transactions?: TransactionData[],
  omit?: string[],
) => {
  if (!accounts || !transactions) return;
  const filteredAccounts = accounts.filter((acct) => !omit?.includes(acct.id));

  const filteredTransactions = transactions.filter(
    (txn) => !omit?.includes(txn.account),
  );

  const currTotal = getCurrentTotal(filteredAccounts);

  const today = new Date().toISOString().split('T')[0];
  const transactionsByDay: Record<string, number> = { [today]: currTotal };

  let runningTotal = currTotal;

  for (const transaction of filteredTransactions) {
    if (transaction.status !== 'posted') continue;

    const timestamp = transaction.transacted_at || 0;
    const date = new Date(timestamp * 1000).toISOString().split('T')[0];

    const amount = transaction.amount || 0;
    runningTotal -= amount;

    transactionsByDay[date] = runningTotal;
  }

  // Convert to list of dicts format
  const dailyTotals: RunningTotalData[] = Object.entries(transactionsByDay).map(
    ([date, total]) => ({
      date,
      total,
    }),
  );

  return dailyTotals;
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

const hasRecurringPattern = (transactions: TransactionData[]): boolean => {
  if (transactions.length < 2) return false;

  // Constants for time intervals in seconds
  const DAY_IN_SECONDS = 24 * 60 * 60;
  const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
  const MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
  const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

  // Padding values in seconds
  const WEEK_PADDING = 1 * DAY_IN_SECONDS;
  const MONTH_PADDING = 3 * DAY_IN_SECONDS;
  const YEAR_PADDING = 7 * DAY_IN_SECONDS;

  const intervals = [];

  for (let i = 1; i < transactions.length; i++) {
    const interval =
      transactions[i].transacted_at - transactions[i - 1].transacted_at;
    intervals.push(interval);
  }

  // Check if all intervals correspond to one of the accepted recurring periods (with padding)
  return intervals.every(
    (interval) =>
      // Weekly pattern (with 1 day padding)
      Math.abs(interval - WEEK_IN_SECONDS) <= WEEK_PADDING ||
      // Monthly pattern (with 3 day padding)
      Math.abs(interval - MONTH_IN_SECONDS) <= MONTH_PADDING ||
      // Yearly pattern (with 1 week padding)
      Math.abs(interval - YEAR_IN_SECONDS) <= YEAR_PADDING,
  );
};

export const getRecurringCharges = (txns: TransactionData[]) => {
  const recurringMap: Record<string, TransactionData[]> = {};

  txns.forEach((txn) => {
    if (txn.amount > 0) return;

    const key = `${txn.description}_${txn.account}`;
    if (recurringMap[key]) {
      recurringMap[key] = [...recurringMap[key], txn];
    } else {
      recurringMap[key] = [txn];
    }
  });

  const filteredRecurringMap: Record<string, TransactionData[]> = {};

  Object.keys(recurringMap).forEach((key) => {
    if (recurringMap[key].length >= 2) {
      const transactions = recurringMap[key].sort(
        (a, b) => a.transacted_at - b.transacted_at,
      );

      // Check if these transactions follow a recurring pattern
      if (hasRecurringPattern(transactions)) {
        filteredRecurringMap[key] = transactions;
      }
    }
  });

  return filteredRecurringMap;
};
