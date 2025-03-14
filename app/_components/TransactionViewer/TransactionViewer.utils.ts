import { TransactionData } from '../../_models/TransactionData';
import { formatDate } from '../../_utils/utils';
import {
  GroupedRecurringTransactions,
  ValidRecurrencePattern,
} from './components/RecurringTransactions/RecurringTransactions.types';
import { GroupedTransactions } from './TransactionViewer.types';
import uFuzzy from '@leeoniya/ufuzzy';

export const groupTransactionsByDate = (
  transactions: TransactionData[],
): GroupedTransactions => {
  const grouped: GroupedTransactions = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.transacted_at * 1000);
    const dateString = formatDate(date);

    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }

    grouped[dateString].push(tx);
  });

  return grouped;
};

const hasRecurringPattern = (
  transactions: TransactionData[],
): ValidRecurrencePattern | null => {
  if (transactions.length < 2) return null;

  // Constants for time intervals in seconds
  const DAY_IN_SECONDS = 24 * 60 * 60;
  const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
  const MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
  const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

  // Padding values in seconds
  const WEEK_PADDING = 1 * DAY_IN_SECONDS;
  const MONTH_PADDING = 2 * DAY_IN_SECONDS;
  const YEAR_PADDING = 7 * DAY_IN_SECONDS;

  const intervals = [];

  for (let i = 1; i < transactions.length; i++) {
    const interval =
      transactions[i].transacted_at - transactions[i - 1].transacted_at;
    intervals.push(interval);
  }
  // const isWeekly = intervals.every(
  //   (interval) => Math.abs(interval - WEEK_IN_SECONDS) <= WEEK_PADDING,
  // );
  // if (isWeekly) return 'weekly';

  const isMonthly = intervals.every(
    (interval) => Math.abs(interval - MONTH_IN_SECONDS) <= MONTH_PADDING,
  );
  if (isMonthly) return 'monthly';

  // const isYearly = intervals.every(d
  //   (interval) => Math.abs(interval - YEAR_IN_SECONDS) <= YEAR_PADDING,
  // );
  // if (isYearly) return 'yearly';

  return null;
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

  const filteredRecurringMap: GroupedRecurringTransactions = {};

  Object.keys(recurringMap).forEach((key) => {
    if (recurringMap[key].length >= 2) {
      const transactions = recurringMap[key].sort(
        (a, b) => a.transacted_at - b.transacted_at,
      );

      const pattern = hasRecurringPattern(transactions);
      if (!!pattern) {
        filteredRecurringMap[key] = {
          pattern,
          transactions,
        };
      }
    }
  });

  return filteredRecurringMap;
};

export const fuzzyFilter = (
  query: string,
  transactions: TransactionData[],
): TransactionData[] => {
  if (!query.trim()) {
    return transactions;
  }

  const u = new uFuzzy();

  // Create array of descriptions to search through
  const descriptions = transactions.map((tx) => tx.description);

  // Perform the fuzzy search on descriptions
  const results = u.search(descriptions, query);

  // If no results found, return empty array
  if (!results || !results[0]) {
    return [];
  }

  // Return only the transactions whose descriptions matched the search
  return results[0].map((idx) => transactions[idx]);
};
