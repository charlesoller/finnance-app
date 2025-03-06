import { LineChartDataPoint } from '../../_models/ChartData';
import { TransactionData } from '../../_models/TransactionData';
import { formatDate } from '../../_utils/utils';

export const formatTransactions = (
  tx: TransactionData[],
): LineChartDataPoint[] => {
  let runningTotal = 0;
  return tx
    .sort((a, b) => a.transacted_at - b.transacted_at)
    .map(({ amount, transacted_at }) => {
      runningTotal += amount / 100;
      return {
        date: String(new Date(transacted_at * 1000)),
        amount: runningTotal,
      };
    });
};

export interface GroupedTransactions {
  [dateString: string]: TransactionData[];
}

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
