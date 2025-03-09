import { AccountData } from '../../_models/AccountData';
import { LineChartDataPoint } from '../../_models/ChartData';
import {
  RunningTotalData,
  TransactionData,
} from '../../_models/TransactionData';

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

export const getCurrentTotal = (accounts: AccountData[]) => {
  let total = 0;
  for (const account of accounts) {
    const balance = account?.balance?.current?.usd;
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
