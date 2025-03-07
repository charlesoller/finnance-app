import { LineChartDataPoint } from '../../_models/ChartData';
import { TransactionData } from '../../_models/TransactionData';
import { formatDate } from '../../_utils/utils';

export const formatTransactions = (
  tx: TransactionData[],
  balance: number,
): LineChartDataPoint[] => {
  let runningTotal = balance;

  return tx
    .sort((a, b) => b.transacted_at - a.transacted_at)
    .map(({ amount, transacted_at }) => {
      const point = {
        date: String(new Date(transacted_at * 1000)),
        amount: runningTotal,
      };

      runningTotal -= amount / 100;

      return point;
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
